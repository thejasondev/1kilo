import { db, type UserProfile } from "@/lib/storage/db";

export interface ExportData {
  version: "1.0";
  exportedAt: string;
  profile: UserProfile | null;
  weightLogs: Array<{
    date: string;
    weight: number;
  }>;
  dailyLogs: Array<{
    date: string;
    calories: number;
    macros: { protein: number; carbs: number; fats: number };
  }>;
  routines: Array<{
    id: string;
    name: string;
    category: string;
    exercises: unknown[];
  }>;
}

/**
 * Export all user data to a JSON file
 */
export async function exportUserData(userId: string): Promise<void> {
  const profile = await db.profile.get(userId);
  const weightLogs = await db.weight_logs
    .where("userId")
    .equals(userId)
    .toArray();
  const dailyLogs = await db.daily_logs
    .where("userId")
    .equals(userId)
    .toArray();
  const routines = await db.routines.toArray();

  const exportData: ExportData = {
    version: "1.0",
    exportedAt: new Date().toISOString(),
    profile: profile || null,
    weightLogs: weightLogs.map((log) => ({
      date: log.date,
      weight: log.weight,
    })),
    dailyLogs: dailyLogs.map((log) => ({
      date: log.date,
      calories: log.calories,
      macros: log.macros,
    })),
    routines: routines.map((r) => ({
      id: r.id,
      name: r.name,
      category: r.category,
      exercises: r.exercises,
    })),
  };

  // Create and download file
  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `1kilo-backup-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Import user data from a JSON file
 */
export async function importUserData(
  file: File,
  userId: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const text = await file.text();
    const data: ExportData = JSON.parse(text);

    if (data.version !== "1.0") {
      return { success: false, message: "Versión de backup no soportada" };
    }

    // Import profile (update or create)
    if (data.profile) {
      const existingProfile = await db.profile.get(userId);
      if (existingProfile) {
        await db.profile.update(userId, { ...data.profile, id: userId });
      } else {
        await db.profile.add({ ...data.profile, id: userId });
      }
    }

    // Import weight logs
    for (const log of data.weightLogs) {
      const existing = await db.weight_logs
        .where(["userId", "date"])
        .equals([userId, log.date])
        .first();
      if (!existing) {
        await db.weight_logs.add({
          userId,
          date: log.date,
          weight: log.weight,
        });
      }
    }

    // Import daily logs
    for (const log of data.dailyLogs) {
      const existing = await db.daily_logs.get({ userId, date: log.date });
      if (!existing) {
        await db.daily_logs.add({
          userId,
          date: log.date,
          calories: log.calories,
          macros: log.macros,
          meals: [],
        });
      }
    }

    return {
      success: true,
      message: `Importados: ${data.weightLogs.length} registros de peso, ${data.dailyLogs.length} días de diario`,
    };
  } catch (error) {
    console.error("Import error:", error);
    return {
      success: false,
      message: "Error al leer el archivo de backup",
    };
  }
}
