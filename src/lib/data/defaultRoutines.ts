import type { Routine } from "./routinesDb";

export const DEFAULT_ROUTINES: Record<
  "ectomorph" | "mesomorph" | "endomorph",
  Routine
> = {
  ectomorph: {
    id: "ecto-strength-default",
    name: "Ectomorfo - Fuerza & Masa",
    description:
      "Rutina enfocada en ejercicios compuestos con pausas largas para maximizar ganancia de masa sin quemar exceso de calorías.",
    category: "Ectomorfo",
    exercises: [
      { exerciseId: "squat", sets: 3, reps: 6 },
      { exerciseId: "bench-press", sets: 3, reps: 8 },
      { exerciseId: "overhead-press", sets: 3, reps: 8 },
      { exerciseId: "deadlift", sets: 2, reps: 5 },
      { exerciseId: "row", sets: 3, reps: 8 },
    ],
  },
  mesomorph: {
    id: "meso-hypertrophy-default",
    name: "Mesomorfo - Hipertrofia Balanceada",
    description:
      "Rutina dividida (Upper/Lower) ideal para ganar masa muscular aprovechando tu capacidad de recuperación.",
    category: "Mesomorfo",
    exercises: [
      { exerciseId: "squat", sets: 4, reps: 10 },
      { exerciseId: "lunge", sets: 3, reps: 12 },
      { exerciseId: "bench-press", sets: 4, reps: 10 },
      { exerciseId: "row", sets: 4, reps: 10 },
      { exerciseId: "lateral-raise", sets: 3, reps: 15 },
    ],
  },
  endomorph: {
    id: "endo-metabolic-default",
    name: "Endomorfo - Quema Metabólica",
    description:
      "Alta densidad de trabajo, superseries y rangos de repeticiones más altos para elevar el gasto calórico.",
    category: "Endomorfo",
    exercises: [
      { exerciseId: "squat", sets: 4, reps: 15 },
      { exerciseId: "push-up", sets: 4, reps: 15 },
      { exerciseId: "jump-rope", sets: 4, reps: 60 },
      { exerciseId: "lunge", sets: 3, reps: 20 },
      { exerciseId: "plank", sets: 3, reps: 60 }, // seconds
    ],
  },
};
