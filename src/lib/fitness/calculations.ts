export const ACTIVITY_LEVELS = [
  { value: 1.2, label: "Sedentario", description: "Poco o nada de ejercicio" },
  { value: 1.375, label: "Ligero", description: "Ejercicio 1-3 días/semana" },
  { value: 1.55, label: "Moderado", description: "Ejercicio 3-5 días/semana" },
  { value: 1.725, label: "Activo", description: "Ejercicio 6-7 días/semana" },
  {
    value: 1.9,
    label: "Atleta",
    description: "Trabajo físico o doble entreno",
  },
];

export const GOALS = [
  { value: "cut", label: "Perder Grasa", multiplier: 0.85 }, // Legacy/Fallback
  { value: "maintain", label: "Mantener", multiplier: 1.0 },
  { value: "bulk", label: "Ganar Músculo", multiplier: 1.1 },
];

export const SOMATOTYPES = [
  {
    value: "ectomorph",
    label: "Ectomorfo",
    description: "Delgado, dificultad para ganar peso.",
    macroMod: { c: 0.55, p: 0.25, f: 0.2 }, // High Carb preference
  },
  {
    value: "mesomorph",
    label: "Mesomorfo",
    description: "Atlético, gana músculo con facilidad.",
    macroMod: { c: 0.4, p: 0.3, f: 0.3 }, // Balanced
  },
  {
    value: "endomorph",
    label: "Endomorfo",
    description: "Estructura ancha, tiende a acumular grasa.",
    macroMod: { c: 0.25, p: 0.4, f: 0.35 }, // Low Carb preference
  },
];

// Evidence-based rate limits (kg/week)
// Sources: CDC, NHS, Healthline research
export const RATE_LIMITS = {
  cut: {
    min: -0.75, // Max safe loss rate
    max: -0.25, // Minimum meaningful deficit
    recommended: -0.5,
    label: "Pérdida",
  },
  bulk: {
    min: 0.1, // Minimum meaningful surplus
    max: 0.35, // Max for lean gains (avoid excess fat)
    recommended: 0.25,
    label: "Ganancia",
  },
  maintain: {
    min: -0.1,
    max: 0.1,
    recommended: 0,
    label: "Mantenimiento",
  },
};

// Legacy export for backwards compatibility
export const RECOMMENDED_RATES = {
  cut: -0.5,
  maintain: 0,
  bulk: 0.25,
};

// Minimum safe daily calories (WHO guideline)
export const MIN_SAFE_CALORIES = 1200;

// Check if rate is too aggressive
export function isAggressiveRate(
  goal: "cut" | "maintain" | "bulk",
  rate: number,
): boolean {
  if (goal === "cut" && rate < -0.75) return true;
  if (goal === "bulk" && rate > 0.35) return true;
  return false;
}

// Get rate intensity label
export function getRateIntensity(
  goal: "cut" | "maintain" | "bulk",
  rate: number,
): { label: string; color: string } {
  if (goal === "cut") {
    if (rate <= -0.75) return { label: "Agresivo", color: "text-red-500" };
    if (rate <= -0.5) return { label: "Moderado", color: "text-amber-500" };
    return { label: "Conservador", color: "text-emerald-500" };
  }
  if (goal === "bulk") {
    if (rate >= 0.35) return { label: "Agresivo", color: "text-red-500" };
    if (rate >= 0.25) return { label: "Moderado", color: "text-amber-500" };
    return { label: "Lean", color: "text-emerald-500" };
  }
  return { label: "Estable", color: "text-muted-foreground" };
}

// Calculate weeks to reach target
export function calculateWeeksToGoal(
  currentWeight: number,
  targetWeight: number,
  weeklyRate: number,
): number {
  if (weeklyRate === 0 || currentWeight === targetWeight) return 0;
  const diff = Math.abs(targetWeight - currentWeight);
  return Math.ceil(diff / Math.abs(weeklyRate));
}

export function calculateBMI(weightKg: number, heightCm: number): string {
  if (!weightKg || !heightCm) return "0.0";
  const heightM = heightCm / 100;
  return (weightKg / (heightM * heightM)).toFixed(1);
}

export function getHealthyWeightRange(heightCm: number): {
  min: number;
  max: number;
} {
  const heightM = heightCm / 100;
  return {
    min: Math.round(18.5 * heightM * heightM),
    max: Math.round(25 * heightM * heightM),
  };
}

// Mifflin-St Jeor Equation
export function calculateBMR(
  weight: number,
  height: number,
  age: number,
  gender: "male" | "female",
): number {
  const s = gender === "male" ? 5 : -161;
  return 10 * weight + 6.25 * height - 5 * age + s;
}

export function calculateTDEE(bmr: number, activityLevel: number): number {
  return Math.round(bmr * activityLevel);
}

// Legacy Function
export function calculateTargetCalories(
  tdee: number,
  goal: "cut" | "maintain" | "bulk",
): number {
  const goalObj = GOALS.find((g) => g.value === goal);
  return Math.round(tdee * (goalObj?.multiplier || 1.0));
}

// Smart Calculation based on Rate
export function calculateSmartCalories(
  tdee: number,
  weeklyRateKg: number,
): number {
  // ~7700 kcal per kg of tissue.
  // Daily imbalance = (Rate * 7700) / 7 = Rate * 1100
  const dailyImbalance = weeklyRateKg * 1100;
  return Math.round(tdee + dailyImbalance);
}

export function calculateProjectedDate(
  currentWeight: number,
  targetWeight: number,
  weeklyRate: number,
): Date {
  if (weeklyRate === 0) return new Date(); // Never? Or indefinite.

  // If direction mismatch (e.g. Cut but Rate > 0), return far future or handle error?
  const diff = targetWeight - currentWeight;
  if ((diff > 0 && weeklyRate < 0) || (diff < 0 && weeklyRate > 0)) {
    // Impossible direction
    const farFuture = new Date();
    farFuture.setFullYear(farFuture.getFullYear() + 10);
    return farFuture;
  }

  const weeks = diff / weeklyRate;
  const days = Math.abs(weeks * 7);

  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + days);
  return targetDate;
}

/**
 * Calculate macronutrient targets using evidence-based approach.
 *
 * Protein: Based on bodyweight (g/kg) - scientific standard
 * - Cut: 2.0 g/kg (preserve muscle during deficit)
 * - Bulk: 1.8 g/kg (support muscle growth)
 * - Maintain: 1.6 g/kg (general fitness)
 *
 * Fat: 20-35% of calories (essential for hormones)
 * Carbs: Remaining calories (fuel for activity)
 */
export function calculateMacros(
  calories: number,
  goal: "cut" | "maintain" | "bulk",
  weightKg?: number,
  somatotype?: "ectomorph" | "mesomorph" | "endomorph",
): { protein: number; carbs: number; fats: number } {
  // Protein per kg based on goal (scientific evidence)
  const proteinPerKg: Record<string, number> = {
    cut: 2.0, // Higher to preserve muscle during deficit
    bulk: 1.8, // Support muscle protein synthesis
    maintain: 1.6, // General active adult
  };

  // Fat percentage based on goal and somatotype
  let fatPercent = 0.25; // Default 25%
  if (goal === "cut") {
    fatPercent = 0.3; // Higher fat keeps satiety during deficit
  } else if (goal === "bulk") {
    fatPercent = 0.2; // Lower fat, more room for carbs
  }

  // Somatotype adjustments for fat/carb split
  if (somatotype === "endomorph") {
    fatPercent = Math.min(0.35, fatPercent + 0.05); // More fat, less carbs
  } else if (somatotype === "ectomorph") {
    fatPercent = Math.max(0.15, fatPercent - 0.05); // Less fat, more carbs
  }

  // Calculate protein from bodyweight if available
  let proteinGrams: number;
  if (weightKg && weightKg > 0) {
    // Evidence-based: g/kg bodyweight
    proteinGrams = Math.round(weightKg * proteinPerKg[goal]);
  } else {
    // Fallback to percentage if no weight (legacy support)
    const proteinPercent = goal === "cut" ? 0.35 : goal === "bulk" ? 0.3 : 0.3;
    proteinGrams = Math.round((calories * proteinPercent) / 4);
  }

  // Calculate fat
  const fatCals = calories * fatPercent;
  const fatGrams = Math.round(fatCals / 9);

  // Remaining calories go to carbs
  const proteinCals = proteinGrams * 4;
  const carbCals = Math.max(200, calories - proteinCals - fatCals); // Min 50g carbs
  const carbGrams = Math.round(carbCals / 4);

  return {
    protein: proteinGrams,
    carbs: carbGrams,
    fats: fatGrams,
  };
}
