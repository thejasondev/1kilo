import { describe, it, expect } from "vitest";
import {
  calculateBMI,
  calculateBMR,
  calculateTDEE,
  calculateMacros,
  calculateSmartCalories,
  getHealthyWeightRange,
  calculateTargetCalories,
} from "@/lib/fitness/calculations";

describe("calculateBMI", () => {
  it("calculates BMI correctly for average person", () => {
    // 70kg, 175cm should be ~22.9 (normal weight)
    expect(calculateBMI(70, 175)).toBe("22.9");
  });

  it("calculates BMI for overweight person", () => {
    // 100kg, 180cm should be ~30.9 (obese)
    expect(calculateBMI(100, 180)).toBe("30.9");
  });

  it("returns 0.0 for invalid inputs", () => {
    expect(calculateBMI(0, 175)).toBe("0.0");
    expect(calculateBMI(70, 0)).toBe("0.0");
  });
});

describe("calculateBMR (Mifflin-St Jeor)", () => {
  it("calculates BMR for a male", () => {
    // Male: 10*80 + 6.25*180 - 5*30 + 5 = 800 + 1125 - 150 + 5 = 1780
    const bmr = calculateBMR(80, 180, 30, "male");
    expect(bmr).toBe(1780);
  });

  it("calculates BMR for a female", () => {
    // Female: 10*60 + 6.25*165 - 5*25 - 161 = 600 + 1031.25 - 125 - 161 = 1345.25
    const bmr = calculateBMR(60, 165, 25, "female");
    expect(bmr).toBeCloseTo(1345.25, 2);
  });
});

describe("calculateTDEE", () => {
  it("multiplies BMR by activity level", () => {
    const bmr = 1800;
    expect(calculateTDEE(bmr, 1.2)).toBe(2160); // Sedentary
    expect(calculateTDEE(bmr, 1.55)).toBe(2790); // Moderate
    expect(calculateTDEE(bmr, 1.9)).toBe(3420); // Athlete
  });

  it("rounds to nearest integer", () => {
    expect(calculateTDEE(1785, 1.375)).toBe(2454); // 2454.375 -> 2454
  });
});

describe("calculateTargetCalories", () => {
  it("applies cut multiplier (0.85)", () => {
    expect(calculateTargetCalories(2000, "cut")).toBe(1700);
  });

  it("maintains calories for maintenance", () => {
    expect(calculateTargetCalories(2000, "maintain")).toBe(2000);
  });

  it("applies bulk multiplier (1.1)", () => {
    expect(calculateTargetCalories(2000, "bulk")).toBe(2200);
  });
});

describe("calculateSmartCalories", () => {
  it("subtracts calories for weight loss (-0.5kg/week)", () => {
    // -0.5 * 1100 = -550 kcal/day
    expect(calculateSmartCalories(2500, -0.5)).toBe(1950);
  });

  it("adds calories for weight gain (+0.25kg/week)", () => {
    // +0.25 * 1100 = +275 kcal/day
    expect(calculateSmartCalories(2500, 0.25)).toBe(2775);
  });

  it("returns TDEE for maintenance (0 rate)", () => {
    expect(calculateSmartCalories(2500, 0)).toBe(2500);
  });
});

describe("calculateMacros", () => {
  it("calculates protein from bodyweight for cut (2.0 g/kg)", () => {
    // 70kg person on cut = 70 * 2.0 = 140g protein
    const macros = calculateMacros(2000, "cut", 70);
    expect(macros.protein).toBe(140);
  });

  it("calculates protein from bodyweight for bulk (1.8 g/kg)", () => {
    // 80kg person on bulk = 80 * 1.8 = 144g protein
    const macros = calculateMacros(3000, "bulk", 80);
    expect(macros.protein).toBe(144);
  });

  it("calculates protein from bodyweight for maintain (1.6 g/kg)", () => {
    // 75kg person maintaining = 75 * 1.6 = 120g protein
    const macros = calculateMacros(2500, "maintain", 75);
    expect(macros.protein).toBe(120);
  });

  it("falls back to percentage when no weight provided", () => {
    // Legacy behavior: percentage-based
    const macros = calculateMacros(2000, "cut");
    // 35% of 2000 = 700 kcal / 4 = 175g
    expect(macros.protein).toBe(175);
  });

  it("adjusts fat for ectomorph (less fat, more carbs)", () => {
    const regular = calculateMacros(2500, "maintain", 70);
    const ecto = calculateMacros(2500, "maintain", 70, "ectomorph");
    expect(ecto.fats).toBeLessThan(regular.fats);
    expect(ecto.carbs).toBeGreaterThan(regular.carbs);
  });

  it("adjusts fat for endomorph (more fat, less carbs)", () => {
    const regular = calculateMacros(2500, "maintain", 70);
    const endo = calculateMacros(2500, "maintain", 70, "endomorph");
    expect(endo.fats).toBeGreaterThan(regular.fats);
    expect(endo.carbs).toBeLessThan(regular.carbs);
  });

  it("ensures minimum carbs (50g floor)", () => {
    // Very low calories but still gets minimum carbs
    const macros = calculateMacros(1200, "cut", 100);
    expect(macros.carbs).toBeGreaterThanOrEqual(50);
  });
});

describe("getHealthyWeightRange", () => {
  it("calculates healthy weight range for 175cm", () => {
    const range = getHealthyWeightRange(175);
    // min: 18.5 * (1.75)² = 56.7 -> 57
    // max: 25 * (1.75)² = 76.6 -> 77
    expect(range.min).toBeCloseTo(57, 0);
    expect(range.max).toBeCloseTo(77, 0);
  });

  it("calculates healthy weight range for 160cm", () => {
    const range = getHealthyWeightRange(160);
    expect(range.min).toBeCloseTo(47, 0);
    expect(range.max).toBeCloseTo(64, 0);
  });
});
