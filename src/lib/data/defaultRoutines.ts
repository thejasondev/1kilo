import type { Routine } from "./routinesDb";

// Default routines assigned during onboarding based on somatotype
export const DEFAULT_ROUTINES: Record<
  "ectomorph" | "mesomorph" | "endomorph",
  Routine
> = {
  ectomorph: {
    id: "ecto-push-a",
    name: "Ectomorfo - Push (Día A)",
    description:
      "Pecho, hombros y tríceps. Pesos pesados, descansos largos para máxima fuerza sin quemar exceso de calorías.",
    category: "Ectomorfo",
    difficulty: "intermediate",
    estimatedMinutes: 45,
    restBetweenSets: 150,
    exercises: [
      { exerciseId: "bench-press", sets: 4, reps: 6 },
      { exerciseId: "incline-db-press", sets: 3, reps: 8 },
      { exerciseId: "overhead-press", sets: 3, reps: 8 },
      { exerciseId: "lateral-raise", sets: 3, reps: 12 },
      { exerciseId: "tricep-extension", sets: 3, reps: 10 },
    ],
  },
  mesomorph: {
    id: "meso-upper",
    name: "Mesomorfo - Tren Superior",
    description:
      "Hipertrofia balanceada para pecho, espalda, hombros y brazos. Aprovecha tu buena recuperación.",
    category: "Mesomorfo",
    difficulty: "intermediate",
    estimatedMinutes: 55,
    restBetweenSets: 90,
    exercises: [
      { exerciseId: "bench-press", sets: 4, reps: 10 },
      { exerciseId: "row", sets: 4, reps: 10 },
      { exerciseId: "db-shoulder-press", sets: 3, reps: 12 },
      { exerciseId: "lat-pulldown", sets: 3, reps: 12 },
      { exerciseId: "cable-fly", sets: 3, reps: 15 },
      { exerciseId: "hammer-curl", sets: 3, reps: 12 },
      { exerciseId: "tricep-extension", sets: 3, reps: 12 },
    ],
  },
  endomorph: {
    id: "endo-fullbody-a",
    name: "Endomorfo - Full Body A",
    description:
      "Circuito metabólico con ejercicios compuestos. Descansos cortos para máxima quema calórica.",
    category: "Endomorfo",
    difficulty: "intermediate",
    estimatedMinutes: 45,
    restBetweenSets: 45,
    exercises: [
      { exerciseId: "goblet-squat", sets: 4, reps: 15 },
      { exerciseId: "push-up", sets: 4, reps: 15 },
      { exerciseId: "db-row", sets: 4, reps: 12 },
      { exerciseId: "walking-lunge", sets: 3, reps: 12 },
      { exerciseId: "mountain-climbers", sets: 3, reps: 30 },
      { exerciseId: "plank", sets: 3, reps: 45 },
    ],
  },
};
