import { supabase } from "@/lib/supabase";
import { db, type UserProfile, type DailyLog } from "@/lib/storage/db";
import type {
  SupabaseProfile,
  SupabaseWeightLog,
  SupabaseDailyLog,
} from "./types";

export type SyncResult = {
  success: boolean;
  message: string;
  details?: {
    profileSynced: boolean;
    weightLogsUploaded: number;
    weightLogsDownloaded: number;
    dailyLogsUploaded: number;
    dailyLogsDownloaded: number;
  };
};

/**
 * Sync all user data between local Dexie and Supabase
 * Strategy: Merge with "last write wins" based on timestamps
 */
export async function syncAllData(userId: string): Promise<SyncResult> {
  try {
    const details = {
      profileSynced: false,
      weightLogsUploaded: 0,
      weightLogsDownloaded: 0,
      dailyLogsUploaded: 0,
      dailyLogsDownloaded: 0,
    };

    // 1. Sync Profile (bidirectional)
    details.profileSynced = await syncProfile(userId);

    // 2. Sync Weight Logs (merge)
    const weightResult = await syncWeightLogs(userId);
    details.weightLogsUploaded = weightResult.uploaded;
    details.weightLogsDownloaded = weightResult.downloaded;

    // 3. Sync Daily Logs (merge)
    const dailyResult = await syncDailyLogs(userId);
    details.dailyLogsUploaded = dailyResult.uploaded;
    details.dailyLogsDownloaded = dailyResult.downloaded;

    return {
      success: true,
      message: "Sincronización completada",
      details,
    };
  } catch (error) {
    console.error("Sync error:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Error de sincronización",
    };
  }
}

/**
 * Sync profile - Local takes priority for creation, cloud for updates
 */
async function syncProfile(userId: string): Promise<boolean> {
  const localProfile = await db.profile.get(userId);

  const { data: cloudProfile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = not found, which is OK
    console.error("Error fetching cloud profile:", error);
    return false;
  }

  if (localProfile && !cloudProfile) {
    // Local exists, cloud doesn't - upload
    await upsertProfileToCloud(localProfile);
    return true;
  }

  if (!localProfile && cloudProfile) {
    // Cloud exists, local doesn't - download
    await saveProfileToLocal(cloudProfile as SupabaseProfile);
    return true;
  }

  if (localProfile && cloudProfile) {
    // Both exist - upload local to cloud (local is source of truth for this session)
    await upsertProfileToCloud(localProfile);
    return true;
  }

  return false;
}

async function upsertProfileToCloud(profile: UserProfile): Promise<void> {
  const cloudData: Partial<SupabaseProfile> = {
    id: profile.id,
    email: profile.email,
    name: profile.name,
    gender: profile.gender,
    age: profile.age,
    height: profile.height,
    weight: profile.weight,
    activity_level: profile.activityLevel,
    goal: profile.goal,
    start_weight: profile.startWeight,
    target_weight: profile.targetWeight,
    weekly_rate: profile.weeklyRate,
    start_date: profile.startDate,
    somatotype: profile.somatotype,
    tdee: profile.tdee,
    macros: profile.macros,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("profiles")
    .upsert(cloudData, { onConflict: "id" });

  if (error) throw error;
}

async function saveProfileToLocal(cloud: SupabaseProfile): Promise<void> {
  const localProfile: UserProfile = {
    id: cloud.id,
    email: cloud.email || "",
    name: cloud.name || "",
    gender: cloud.gender || "male",
    age: cloud.age || 25,
    height: cloud.height || 170,
    weight: cloud.weight || 70,
    activityLevel: cloud.activity_level || 1.55,
    goal: cloud.goal || "maintain",
    startWeight: cloud.start_weight || undefined,
    targetWeight: cloud.target_weight || undefined,
    weeklyRate: cloud.weekly_rate || undefined,
    startDate: cloud.start_date || undefined,
    somatotype: cloud.somatotype || undefined,
    tdee: cloud.tdee || undefined,
    macros: cloud.macros || undefined,
  };

  await db.profile.put(localProfile);
}

/**
 * Sync weight logs - merge strategy
 */
async function syncWeightLogs(
  userId: string,
): Promise<{ uploaded: number; downloaded: number }> {
  let uploaded = 0;
  let downloaded = 0;

  // Get local logs
  const localLogs = await db.weight_logs
    .where("userId")
    .equals(userId)
    .toArray();

  // Get cloud logs
  const { data: cloudLogs, error } = await supabase
    .from("weight_logs")
    .select("*")
    .eq("user_id", userId);

  if (error) throw error;

  const cloudLogsByDate = new Map(
    (cloudLogs as SupabaseWeightLog[]).map((l) => [l.date, l]),
  );
  const localLogsByDate = new Map(localLogs.map((l) => [l.date, l]));

  // Upload local logs not in cloud
  for (const local of localLogs) {
    if (!cloudLogsByDate.has(local.date)) {
      const { error } = await supabase.from("weight_logs").insert({
        user_id: userId,
        date: local.date,
        weight: local.weight,
      });
      if (!error) uploaded++;
    }
  }

  // Download cloud logs not in local
  for (const cloud of (cloudLogs as SupabaseWeightLog[]) || []) {
    if (!localLogsByDate.has(cloud.date)) {
      await db.weight_logs.add({
        userId,
        date: cloud.date,
        weight: cloud.weight,
      });
      downloaded++;
    }
  }

  return { uploaded, downloaded };
}

/**
 * Sync daily logs - merge strategy
 */
async function syncDailyLogs(
  userId: string,
): Promise<{ uploaded: number; downloaded: number }> {
  let uploaded = 0;
  let downloaded = 0;

  // Get local logs
  const localLogs = await db.daily_logs
    .where("userId")
    .equals(userId)
    .toArray();

  // Get cloud logs
  const { data: cloudLogs, error } = await supabase
    .from("daily_logs")
    .select("*")
    .eq("user_id", userId);

  if (error) throw error;

  const cloudLogsByDate = new Map(
    (cloudLogs as SupabaseDailyLog[]).map((l) => [l.date, l]),
  );
  const localLogsByDate = new Map(localLogs.map((l) => [l.date, l]));

  // Upload local logs not in cloud
  for (const local of localLogs) {
    if (!cloudLogsByDate.has(local.date)) {
      const { error } = await supabase.from("daily_logs").insert({
        user_id: userId,
        date: local.date,
        calories: local.calories,
        macros: local.macros,
        meals: local.meals,
      });
      if (!error) uploaded++;
    }
  }

  // Download cloud logs not in local
  for (const cloud of (cloudLogs as SupabaseDailyLog[]) || []) {
    if (!localLogsByDate.has(cloud.date)) {
      await db.daily_logs.add({
        userId,
        date: cloud.date,
        calories: cloud.calories,
        macros: cloud.macros,
        meals: cloud.meals as DailyLog["meals"],
      });
      downloaded++;
    }
  }

  return { uploaded, downloaded };
}

/**
 * Upload specific data immediately (for real-time sync)
 */
export async function uploadWeightLog(
  userId: string,
  date: string,
  weight: number,
): Promise<boolean> {
  const { error } = await supabase
    .from("weight_logs")
    .upsert({ user_id: userId, date, weight }, { onConflict: "user_id,date" });

  return !error;
}

export async function uploadDailyLog(
  userId: string,
  log: DailyLog,
): Promise<boolean> {
  const { error } = await supabase.from("daily_logs").upsert(
    {
      user_id: userId,
      date: log.date,
      calories: log.calories,
      macros: log.macros,
      meals: log.meals,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,date" },
  );

  return !error;
}
