import Dexie, { type EntityTable } from "dexie";
import type { Routine } from "../data/routinesDb";

export interface UserProfile {
  id: string; // matches auth user id
  email: string;
  name: string;
  gender: "male" | "female";
  age: number;
  height: number; // cm
  weight: number; // kg
  activityLevel: number; // 1.2 to 1.9

  // Smart Goal Fields
  goal: "cut" | "maintain" | "bulk"; // Strategy
  startWeight?: number; // Starting point for the goal
  targetWeight?: number; // Target in kg
  weeklyRate?: number; // Target change per week (e.g. -0.5 or +0.2)
  startDate?: string; // When the goal was set (ISO Date)

  // Somatotype
  somatotype?: "ectomorph" | "mesomorph" | "endomorph";

  tdee?: number;
  macros?: {
    protein: number;
    carbs: number;
    fats: number;
  };
}

export interface WeightLog {
  id?: number; // auto-increment
  userId: string;
  date: string; // YYYY-MM-DD
  weight: number;
}

export interface MealEntry {
  id: string;
  foodId: string;
  foodName: string;
  mealType: "desayuno" | "almuerzo" | "cena" | "merienda";
  quantity: number;
  unit: string;
  grams: number;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  timestamp: string;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD (PK)
  userId: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  meals: MealEntry[]; // Array of logged food entries
}

// Define DB
const db = new Dexie("1KiloDB") as Dexie & {
  routines: EntityTable<Routine, "id">;
  profile: EntityTable<UserProfile, "id">;
  weight_logs: EntityTable<WeightLog, "id">;
  daily_logs: EntityTable<DailyLog, "date">;
};

// Define Schema
// Version 1: routines
// Version 2: added profile
// Version 3: added weight_logs, daily_logs
// Version 4: updated profile interface (Schema matches)
db.version(4).stores({
  routines: "id, name, category",
  profile: "id, email",
  weight_logs: "++id, userId, date",
  daily_logs: "date, userId",
});

export { db };
