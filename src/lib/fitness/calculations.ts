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

// Recommended Rates (kg/week)
export const RECOMMENDED_RATES = {
  cut: -0.5,
  maintain: 0,
  bulk: 0.25,
};

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

export function calculateMacros(
  calories: number,
  goal: "cut" | "maintain" | "bulk",
  somatotype?: "ectomorph" | "mesomorph" | "endomorph",
) {
  // Default Ratios
  let ratios = { p: 0.3, c: 0.4, f: 0.3 };

  // Goal Influence (Priority on Protein)
  if (goal === "cut") ratios = { p: 0.4, c: 0.25, f: 0.35 };
  if (goal === "bulk") ratios = { p: 0.3, c: 0.5, f: 0.2 };

  // Somatotype Logic (Refines the Carb/Fat split mostly)
  if (somatotype) {
    if (somatotype === "ectomorph") {
      // Can handle more carbs
      ratios.c += 0.1;
      ratios.f -= 0.1;
    } else if (somatotype === "endomorph") {
      // Less carbs, more fat/protein
      ratios.c = Math.max(0.1, ratios.c - 0.1);
      ratios.f += 0.05;
      ratios.p += 0.05;
    }
    // Mesomorph stays roughly balanced

    // Normalize to 1.0 just in case
    const total = ratios.p + ratios.c + ratios.f;
    ratios.p /= total;
    ratios.c /= total;
    ratios.f /= total;
  }

  return {
    protein: Math.round((calories * ratios.p) / 4),
    carbs: Math.round((calories * ratios.c) / 4),
    fats: Math.round((calories * ratios.f) / 9),
  };
}
