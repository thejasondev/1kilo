// Supabase Database Types (generated from schema)

export interface SupabaseProfile {
  id: string;
  email: string | null;
  name: string | null;
  gender: "male" | "female" | null;
  age: number | null;
  height: number | null;
  weight: number | null;
  activity_level: number | null;
  goal: "cut" | "maintain" | "bulk" | null;
  start_weight: number | null;
  target_weight: number | null;
  weekly_rate: number | null;
  start_date: string | null;
  somatotype: "ectomorph" | "mesomorph" | "endomorph" | null;
  tdee: number | null;
  macros: { protein: number; carbs: number; fats: number } | null;
  created_at: string;
  updated_at: string;
}

export interface SupabaseWeightLog {
  id: string;
  user_id: string;
  date: string;
  weight: number;
  created_at: string;
}

export interface SupabaseDailyLog {
  id: string;
  user_id: string;
  date: string;
  calories: number;
  macros: { protein: number; carbs: number; fats: number };
  meals: unknown[];
  created_at: string;
  updated_at: string;
}

// Database table names
export type TableName = "profiles" | "weight_logs" | "daily_logs";
