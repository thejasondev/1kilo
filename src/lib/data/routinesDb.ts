export interface RoutineExercise {
  exerciseId: string;
  sets: number;
  reps: number;
  restSeconds?: number; // Rest between sets
}

export interface Routine {
  id: string;
  name: string;
  description: string;
  category: "Ectomorfo" | "Endomorfo" | "Mesomorfo" | "Pro" | "Personalizada";
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedMinutes: number;
  restBetweenSets: number; // Default rest in seconds
  exercises: RoutineExercise[];
}

// Evidence-based routines optimized for each somatotype
export const PREDEFINED_ROUTINES: Routine[] = [
  // ==================== ECTOMORFO ====================
  // Focus: Heavy compounds, longer rest, minimal cardio
  {
    id: "ecto-push-a",
    name: "Ectomorfo - Push (Día A)",
    description:
      "Pecho, hombros y tríceps. Pesos pesados, descansos largos para máxima fuerza.",
    category: "Ectomorfo",
    difficulty: "intermediate",
    estimatedMinutes: 45,
    restBetweenSets: 150, // 2.5 min
    exercises: [
      { exerciseId: "bench-press", sets: 4, reps: 6 },
      { exerciseId: "incline-db-press", sets: 3, reps: 8 },
      { exerciseId: "overhead-press", sets: 3, reps: 8 },
      { exerciseId: "lateral-raise", sets: 3, reps: 12 },
      { exerciseId: "tricep-extension", sets: 3, reps: 10 },
    ],
  },
  {
    id: "ecto-pull-b",
    name: "Ectomorfo - Pull (Día B)",
    description:
      "Espalda y bíceps. Ejercicios compuestos para construir masa en la espalda.",
    category: "Ectomorfo",
    difficulty: "intermediate",
    estimatedMinutes: 45,
    restBetweenSets: 150,
    exercises: [
      { exerciseId: "deadlift", sets: 3, reps: 5 },
      { exerciseId: "row", sets: 4, reps: 8 },
      { exerciseId: "lat-pulldown", sets: 3, reps: 10 },
      { exerciseId: "face-pull", sets: 3, reps: 15 },
      { exerciseId: "barbell-curl", sets: 3, reps: 10 },
    ],
  },
  {
    id: "ecto-legs-c",
    name: "Ectomorfo - Piernas (Día C)",
    description:
      "Cuádriceps, isquios y glúteos. Enfoque en sentadilla y peso muerto rumano.",
    category: "Ectomorfo",
    difficulty: "intermediate",
    estimatedMinutes: 50,
    restBetweenSets: 180, // 3 min for heavy compounds
    exercises: [
      { exerciseId: "squat", sets: 4, reps: 6 },
      { exerciseId: "romanian-dl", sets: 3, reps: 8 },
      { exerciseId: "leg-press", sets: 3, reps: 10 },
      { exerciseId: "leg-curl", sets: 3, reps: 12 },
      { exerciseId: "calf-raise-standing", sets: 4, reps: 15 },
    ],
  },

  // ==================== MESOMORFO ====================
  // Focus: Balanced hypertrophy, moderate rest
  {
    id: "meso-upper",
    name: "Mesomorfo - Tren Superior",
    description:
      "Hipertrofia balanceada para pecho, espalda, hombros y brazos.",
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
  {
    id: "meso-lower",
    name: "Mesomorfo - Tren Inferior",
    description:
      "Piernas completas con énfasis en cuádriceps, isquios y glúteos.",
    category: "Mesomorfo",
    difficulty: "intermediate",
    estimatedMinutes: 55,
    restBetweenSets: 90,
    exercises: [
      { exerciseId: "squat", sets: 4, reps: 10 },
      { exerciseId: "romanian-dl", sets: 3, reps: 12 },
      { exerciseId: "leg-press", sets: 3, reps: 12 },
      { exerciseId: "walking-lunge", sets: 3, reps: 12 },
      { exerciseId: "leg-curl", sets: 3, reps: 15 },
      { exerciseId: "hip-thrust", sets: 3, reps: 12 },
      { exerciseId: "calf-raise-seated", sets: 4, reps: 15 },
    ],
  },

  // ==================== ENDOMORFO ====================
  // Focus: High volume, short rest, metabolic conditioning
  {
    id: "endo-fullbody-a",
    name: "Endomorfo - Full Body A",
    description:
      "Circuito metabólico con ejercicios compuestos. Descansos cortos para máxima quema.",
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
      { exerciseId: "plank", sets: 3, reps: 45 }, // seconds
    ],
  },
  {
    id: "endo-fullbody-b",
    name: "Endomorfo - Full Body B",
    description:
      "Variante con énfasis en piernas y core. Incluye cardio explosivo.",
    category: "Endomorfo",
    difficulty: "intermediate",
    estimatedMinutes: 45,
    restBetweenSets: 45,
    exercises: [
      { exerciseId: "romanian-dl", sets: 4, reps: 12 },
      { exerciseId: "db-bench-press", sets: 4, reps: 12 },
      { exerciseId: "lat-pulldown", sets: 4, reps: 12 },
      { exerciseId: "kb-swing", sets: 4, reps: 20 },
      { exerciseId: "burpees", sets: 3, reps: 12 },
      { exerciseId: "russian-twist", sets: 3, reps: 20 },
    ],
  },
  {
    id: "endo-hiit",
    name: "Endomorfo - HIIT Cardio",
    description:
      "Sesión de cardio de alta intensidad para maximizar quema calórica.",
    category: "Endomorfo",
    difficulty: "intermediate",
    estimatedMinutes: 25,
    restBetweenSets: 30,
    exercises: [
      { exerciseId: "jump-rope", sets: 4, reps: 60 }, // seconds
      { exerciseId: "burpees", sets: 4, reps: 15 },
      { exerciseId: "mountain-climbers", sets: 4, reps: 40 },
      { exerciseId: "box-jump", sets: 3, reps: 12 },
      { exerciseId: "kb-swing", sets: 3, reps: 25 },
    ],
  },

  // ==================== PRO (AVANZADO) ====================
  {
    id: "pro-ppl-push",
    name: "Pro - Push Day",
    description:
      "Día de empuje avanzado: Pecho, hombros y tríceps con técnicas de intensidad.",
    category: "Pro",
    difficulty: "advanced",
    estimatedMinutes: 60,
    restBetweenSets: 90,
    exercises: [
      { exerciseId: "bench-press", sets: 4, reps: 8 },
      { exerciseId: "incline-db-press", sets: 4, reps: 10 },
      { exerciseId: "cable-fly", sets: 3, reps: 15 },
      { exerciseId: "overhead-press", sets: 4, reps: 8 },
      { exerciseId: "lateral-raise", sets: 4, reps: 15 },
      { exerciseId: "skull-crusher", sets: 3, reps: 12 },
      { exerciseId: "tricep-extension", sets: 3, reps: 15 },
    ],
  },
  {
    id: "pro-ppl-pull",
    name: "Pro - Pull Day",
    description:
      "Día de tirón avanzado: Espalda completa y bíceps con volumen alto.",
    category: "Pro",
    difficulty: "advanced",
    estimatedMinutes: 60,
    restBetweenSets: 90,
    exercises: [
      { exerciseId: "deadlift", sets: 3, reps: 5 },
      { exerciseId: "pull-up", sets: 4, reps: 8 },
      { exerciseId: "row", sets: 4, reps: 10 },
      { exerciseId: "cable-row", sets: 3, reps: 12 },
      { exerciseId: "face-pull", sets: 4, reps: 15 },
      { exerciseId: "barbell-curl", sets: 3, reps: 10 },
      { exerciseId: "hammer-curl", sets: 3, reps: 12 },
    ],
  },
  {
    id: "pro-ppl-legs",
    name: "Pro - Leg Day",
    description:
      "Día de piernas avanzado: Cuádriceps, isquios, glúteos y pantorrillas.",
    category: "Pro",
    difficulty: "advanced",
    estimatedMinutes: 65,
    restBetweenSets: 120,
    exercises: [
      { exerciseId: "squat", sets: 4, reps: 8 },
      { exerciseId: "romanian-dl", sets: 4, reps: 10 },
      { exerciseId: "leg-press", sets: 4, reps: 12 },
      { exerciseId: "bulgarian-split", sets: 3, reps: 10 },
      { exerciseId: "leg-curl", sets: 4, reps: 12 },
      { exerciseId: "hip-thrust", sets: 3, reps: 12 },
      { exerciseId: "calf-raise-standing", sets: 5, reps: 15 },
    ],
  },
];
