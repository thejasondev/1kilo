export interface RoutineExercise {
  exerciseId: string;
  sets: number;
  reps: number;
}

export interface Routine {
  id: string;
  name: string;
  description: string;
  category: "Ectomorfo" | "Endomorfo" | "Mesomorfo" | "Pro" | "Personalizada";
  exercises: RoutineExercise[];
}

export const PREDEFINED_ROUTINES: Routine[] = [
  {
    id: "ecto-fullbody-a",
    name: "Ectomorfo - Full Body A",
    description:
      "Enfoque en ejercicios compuestos para ganar masa. Alta intensidad, bajo volumen.",
    category: "Ectomorfo",
    exercises: [
      { exerciseId: "squat", sets: 3, reps: 8 },
      { exerciseId: "bench-press", sets: 3, reps: 8 },
      { exerciseId: "row", sets: 3, reps: 8 },
      { exerciseId: "overhead-press", sets: 2, reps: 10 },
    ],
  },
  {
    id: "endo-circuit",
    name: "Endomorfo - Circuito Metabólico",
    description:
      "Alta frecuencia y repeticiones para maximizar quema calórica.",
    category: "Endomorfo",
    exercises: [
      { exerciseId: "squat", sets: 4, reps: 15 },
      { exerciseId: "push-up", sets: 4, reps: 15 },
      { exerciseId: "jump-rope", sets: 4, reps: 50 },
      { exerciseId: "lunge", sets: 3, reps: 12 },
    ],
  },
  {
    id: "pro-ppl-push",
    name: "Pro - Push (Empuje)",
    description: "Día de empuje avanzado: Pecho, Hombros, Tríceps.",
    category: "Pro",
    exercises: [
      { exerciseId: "bench-press", sets: 4, reps: 8 },
      { exerciseId: "incline-bench", sets: 3, reps: 10 },
      { exerciseId: "overhead-press", sets: 3, reps: 12 },
      { exerciseId: "lateral-raise", sets: 3, reps: 15 },
      { exerciseId: "tricep-extension", sets: 3, reps: 12 },
    ],
  },
];
