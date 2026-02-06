export type MuscleGroup =
  | "Pecho"
  | "Espalda"
  | "Piernas"
  | "Hombros"
  | "Bíceps"
  | "Tríceps"
  | "Abdominales"
  | "Glúteos"
  | "Cardio";

export type Equipment =
  | "Barra"
  | "Mancuernas"
  | "Máquina"
  | "Cable"
  | "Peso Corporal"
  | "Kettlebell"
  | "Cardio";

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  secondaryMuscles?: MuscleGroup[];
  equipment: Equipment;
  difficulty: "beginner" | "intermediate" | "advanced";
}

// Comprehensive exercise database for bodybuilding/fitness
export const EXERCISE_DB: Exercise[] = [
  // ==================== PECHO (CHEST) ====================
  {
    id: "bench-press",
    name: "Press de Banca Plano",
    muscleGroup: "Pecho",
    secondaryMuscles: ["Tríceps", "Hombros"],
    equipment: "Barra",
    difficulty: "intermediate",
  },
  {
    id: "incline-bench",
    name: "Press Inclinado (Barra)",
    muscleGroup: "Pecho",
    secondaryMuscles: ["Hombros", "Tríceps"],
    equipment: "Barra",
    difficulty: "intermediate",
  },
  {
    id: "decline-bench",
    name: "Press Declinado",
    muscleGroup: "Pecho",
    secondaryMuscles: ["Tríceps"],
    equipment: "Barra",
    difficulty: "intermediate",
  },
  {
    id: "db-bench-press",
    name: "Press con Mancuernas",
    muscleGroup: "Pecho",
    secondaryMuscles: ["Tríceps"],
    equipment: "Mancuernas",
    difficulty: "beginner",
  },
  {
    id: "incline-db-press",
    name: "Press Inclinado Mancuernas",
    muscleGroup: "Pecho",
    secondaryMuscles: ["Hombros"],
    equipment: "Mancuernas",
    difficulty: "beginner",
  },
  {
    id: "cable-fly",
    name: "Aperturas en Cable",
    muscleGroup: "Pecho",
    equipment: "Cable",
    difficulty: "beginner",
  },
  {
    id: "pec-deck",
    name: "Pec Deck (Contractora)",
    muscleGroup: "Pecho",
    equipment: "Máquina",
    difficulty: "beginner",
  },
  {
    id: "push-up",
    name: "Flexiones (Push-ups)",
    muscleGroup: "Pecho",
    secondaryMuscles: ["Tríceps", "Hombros"],
    equipment: "Peso Corporal",
    difficulty: "beginner",
  },
  {
    id: "chest-dips",
    name: "Fondos para Pecho",
    muscleGroup: "Pecho",
    secondaryMuscles: ["Tríceps"],
    equipment: "Peso Corporal",
    difficulty: "intermediate",
  },

  // ==================== ESPALDA (BACK) ====================
  {
    id: "deadlift",
    name: "Peso Muerto Convencional",
    muscleGroup: "Espalda",
    secondaryMuscles: ["Piernas", "Glúteos"],
    equipment: "Barra",
    difficulty: "advanced",
  },
  {
    id: "pull-up",
    name: "Dominadas",
    muscleGroup: "Espalda",
    secondaryMuscles: ["Bíceps"],
    equipment: "Peso Corporal",
    difficulty: "intermediate",
  },
  {
    id: "chin-up",
    name: "Dominadas Supinas",
    muscleGroup: "Espalda",
    secondaryMuscles: ["Bíceps"],
    equipment: "Peso Corporal",
    difficulty: "intermediate",
  },
  {
    id: "row",
    name: "Remo con Barra",
    muscleGroup: "Espalda",
    secondaryMuscles: ["Bíceps"],
    equipment: "Barra",
    difficulty: "intermediate",
  },
  {
    id: "db-row",
    name: "Remo con Mancuerna",
    muscleGroup: "Espalda",
    secondaryMuscles: ["Bíceps"],
    equipment: "Mancuernas",
    difficulty: "beginner",
  },
  {
    id: "t-bar-row",
    name: "Remo en T",
    muscleGroup: "Espalda",
    equipment: "Barra",
    difficulty: "intermediate",
  },
  {
    id: "lat-pulldown",
    name: "Jalón al Pecho",
    muscleGroup: "Espalda",
    secondaryMuscles: ["Bíceps"],
    equipment: "Cable",
    difficulty: "beginner",
  },
  {
    id: "cable-row",
    name: "Remo en Polea Baja",
    muscleGroup: "Espalda",
    equipment: "Cable",
    difficulty: "beginner",
  },
  {
    id: "face-pull",
    name: "Face Pull",
    muscleGroup: "Espalda",
    secondaryMuscles: ["Hombros"],
    equipment: "Cable",
    difficulty: "beginner",
  },
  {
    id: "hyperextension",
    name: "Hiperextensiones",
    muscleGroup: "Espalda",
    secondaryMuscles: ["Glúteos"],
    equipment: "Peso Corporal",
    difficulty: "beginner",
  },

  // ==================== PIERNAS (LEGS) ====================
  {
    id: "squat",
    name: "Sentadilla con Barra",
    muscleGroup: "Piernas",
    secondaryMuscles: ["Glúteos"],
    equipment: "Barra",
    difficulty: "intermediate",
  },
  {
    id: "front-squat",
    name: "Sentadilla Frontal",
    muscleGroup: "Piernas",
    equipment: "Barra",
    difficulty: "advanced",
  },
  {
    id: "goblet-squat",
    name: "Sentadilla Goblet",
    muscleGroup: "Piernas",
    secondaryMuscles: ["Glúteos"],
    equipment: "Kettlebell",
    difficulty: "beginner",
  },
  {
    id: "leg-press",
    name: "Prensa de Piernas",
    muscleGroup: "Piernas",
    equipment: "Máquina",
    difficulty: "beginner",
  },
  {
    id: "hack-squat",
    name: "Hack Squat",
    muscleGroup: "Piernas",
    equipment: "Máquina",
    difficulty: "intermediate",
  },
  {
    id: "lunge",
    name: "Zancadas",
    muscleGroup: "Piernas",
    secondaryMuscles: ["Glúteos"],
    equipment: "Mancuernas",
    difficulty: "beginner",
  },
  {
    id: "walking-lunge",
    name: "Zancadas Caminando",
    muscleGroup: "Piernas",
    secondaryMuscles: ["Glúteos"],
    equipment: "Mancuernas",
    difficulty: "intermediate",
  },
  {
    id: "bulgarian-split",
    name: "Sentadilla Búlgara",
    muscleGroup: "Piernas",
    secondaryMuscles: ["Glúteos"],
    equipment: "Mancuernas",
    difficulty: "intermediate",
  },
  {
    id: "romanian-dl",
    name: "Peso Muerto Rumano",
    muscleGroup: "Piernas",
    secondaryMuscles: ["Glúteos", "Espalda"],
    equipment: "Barra",
    difficulty: "intermediate",
  },
  {
    id: "leg-extension",
    name: "Extensión de Cuádriceps",
    muscleGroup: "Piernas",
    equipment: "Máquina",
    difficulty: "beginner",
  },
  {
    id: "leg-curl",
    name: "Curl de Isquiotibiales",
    muscleGroup: "Piernas",
    equipment: "Máquina",
    difficulty: "beginner",
  },
  {
    id: "calf-raise-standing",
    name: "Elevación de Pantorrillas (De Pie)",
    muscleGroup: "Piernas",
    equipment: "Máquina",
    difficulty: "beginner",
  },
  {
    id: "calf-raise-seated",
    name: "Elevación de Pantorrillas (Sentado)",
    muscleGroup: "Piernas",
    equipment: "Máquina",
    difficulty: "beginner",
  },

  // ==================== GLÚTEOS (GLUTES) ====================
  {
    id: "hip-thrust",
    name: "Hip Thrust",
    muscleGroup: "Glúteos",
    secondaryMuscles: ["Piernas"],
    equipment: "Barra",
    difficulty: "intermediate",
  },
  {
    id: "glute-bridge",
    name: "Puente de Glúteos",
    muscleGroup: "Glúteos",
    equipment: "Peso Corporal",
    difficulty: "beginner",
  },
  {
    id: "cable-kickback",
    name: "Patada en Cable",
    muscleGroup: "Glúteos",
    equipment: "Cable",
    difficulty: "beginner",
  },
  {
    id: "sumo-deadlift",
    name: "Peso Muerto Sumo",
    muscleGroup: "Glúteos",
    secondaryMuscles: ["Piernas", "Espalda"],
    equipment: "Barra",
    difficulty: "intermediate",
  },

  // ==================== HOMBROS (SHOULDERS) ====================
  {
    id: "overhead-press",
    name: "Press Militar con Barra",
    muscleGroup: "Hombros",
    secondaryMuscles: ["Tríceps"],
    equipment: "Barra",
    difficulty: "intermediate",
  },
  {
    id: "db-shoulder-press",
    name: "Press de Hombros Mancuernas",
    muscleGroup: "Hombros",
    secondaryMuscles: ["Tríceps"],
    equipment: "Mancuernas",
    difficulty: "beginner",
  },
  {
    id: "arnold-press",
    name: "Arnold Press",
    muscleGroup: "Hombros",
    equipment: "Mancuernas",
    difficulty: "intermediate",
  },
  {
    id: "lateral-raise",
    name: "Elevaciones Laterales",
    muscleGroup: "Hombros",
    equipment: "Mancuernas",
    difficulty: "beginner",
  },
  {
    id: "front-raise",
    name: "Elevaciones Frontales",
    muscleGroup: "Hombros",
    equipment: "Mancuernas",
    difficulty: "beginner",
  },
  {
    id: "rear-delt-fly",
    name: "Pájaros (Deltoides Posterior)",
    muscleGroup: "Hombros",
    equipment: "Mancuernas",
    difficulty: "beginner",
  },
  {
    id: "upright-row",
    name: "Remo al Mentón",
    muscleGroup: "Hombros",
    secondaryMuscles: ["Tríceps"],
    equipment: "Barra",
    difficulty: "intermediate",
  },
  {
    id: "cable-lateral-raise",
    name: "Elevaciones Laterales en Cable",
    muscleGroup: "Hombros",
    equipment: "Cable",
    difficulty: "beginner",
  },

  // ==================== BÍCEPS ====================
  {
    id: "bicep-curl",
    name: "Curl de Bíceps con Mancuernas",
    muscleGroup: "Bíceps",
    equipment: "Mancuernas",
    difficulty: "beginner",
  },
  {
    id: "barbell-curl",
    name: "Curl de Bíceps con Barra",
    muscleGroup: "Bíceps",
    equipment: "Barra",
    difficulty: "beginner",
  },
  {
    id: "hammer-curl",
    name: "Curl Martillo",
    muscleGroup: "Bíceps",
    equipment: "Mancuernas",
    difficulty: "beginner",
  },
  {
    id: "preacher-curl",
    name: "Curl en Banco Scott",
    muscleGroup: "Bíceps",
    equipment: "Barra",
    difficulty: "beginner",
  },
  {
    id: "cable-curl",
    name: "Curl en Polea",
    muscleGroup: "Bíceps",
    equipment: "Cable",
    difficulty: "beginner",
  },
  {
    id: "concentration-curl",
    name: "Curl Concentrado",
    muscleGroup: "Bíceps",
    equipment: "Mancuernas",
    difficulty: "beginner",
  },
  {
    id: "incline-curl",
    name: "Curl Inclinado",
    muscleGroup: "Bíceps",
    equipment: "Mancuernas",
    difficulty: "intermediate",
  },

  // ==================== TRÍCEPS ====================
  {
    id: "tricep-extension",
    name: "Extensión de Tríceps en Polea",
    muscleGroup: "Tríceps",
    equipment: "Cable",
    difficulty: "beginner",
  },
  {
    id: "skull-crusher",
    name: "Rompecráneos (Skull Crusher)",
    muscleGroup: "Tríceps",
    equipment: "Barra",
    difficulty: "intermediate",
  },
  {
    id: "close-grip-bench",
    name: "Press de Banca Agarre Cerrado",
    muscleGroup: "Tríceps",
    secondaryMuscles: ["Pecho"],
    equipment: "Barra",
    difficulty: "intermediate",
  },
  {
    id: "tricep-dips",
    name: "Fondos para Tríceps",
    muscleGroup: "Tríceps",
    equipment: "Peso Corporal",
    difficulty: "intermediate",
  },
  {
    id: "overhead-tricep-ext",
    name: "Extensión de Tríceps sobre Cabeza",
    muscleGroup: "Tríceps",
    equipment: "Mancuernas",
    difficulty: "beginner",
  },
  {
    id: "tricep-kickback",
    name: "Patada de Tríceps",
    muscleGroup: "Tríceps",
    equipment: "Mancuernas",
    difficulty: "beginner",
  },
  {
    id: "diamond-pushup",
    name: "Flexiones Diamante",
    muscleGroup: "Tríceps",
    secondaryMuscles: ["Pecho"],
    equipment: "Peso Corporal",
    difficulty: "intermediate",
  },

  // ==================== ABDOMINALES (ABS) ====================
  {
    id: "plank",
    name: "Plancha Abdominal",
    muscleGroup: "Abdominales",
    equipment: "Peso Corporal",
    difficulty: "beginner",
  },
  {
    id: "crunch",
    name: "Crunch Abdominal",
    muscleGroup: "Abdominales",
    equipment: "Peso Corporal",
    difficulty: "beginner",
  },
  {
    id: "leg-raise",
    name: "Elevación de Piernas",
    muscleGroup: "Abdominales",
    equipment: "Peso Corporal",
    difficulty: "intermediate",
  },
  {
    id: "hanging-leg-raise",
    name: "Elevación de Piernas Colgando",
    muscleGroup: "Abdominales",
    equipment: "Peso Corporal",
    difficulty: "advanced",
  },
  {
    id: "russian-twist",
    name: "Giro Ruso",
    muscleGroup: "Abdominales",
    equipment: "Peso Corporal",
    difficulty: "beginner",
  },
  {
    id: "cable-crunch",
    name: "Crunch en Polea",
    muscleGroup: "Abdominales",
    equipment: "Cable",
    difficulty: "beginner",
  },
  {
    id: "ab-wheel",
    name: "Rueda Abdominal",
    muscleGroup: "Abdominales",
    equipment: "Peso Corporal",
    difficulty: "intermediate",
  },
  {
    id: "mountain-climbers",
    name: "Mountain Climbers",
    muscleGroup: "Abdominales",
    secondaryMuscles: ["Cardio"],
    equipment: "Peso Corporal",
    difficulty: "beginner",
  },

  // ==================== CARDIO ====================
  {
    id: "running",
    name: "Correr",
    muscleGroup: "Cardio",
    equipment: "Cardio",
    difficulty: "beginner",
  },
  {
    id: "jump-rope",
    name: "Saltar Cuerda",
    muscleGroup: "Cardio",
    equipment: "Cardio",
    difficulty: "beginner",
  },
  {
    id: "rowing-machine",
    name: "Remo (Máquina)",
    muscleGroup: "Cardio",
    secondaryMuscles: ["Espalda"],
    equipment: "Cardio",
    difficulty: "beginner",
  },
  {
    id: "burpees",
    name: "Burpees",
    muscleGroup: "Cardio",
    secondaryMuscles: ["Abdominales", "Piernas"],
    equipment: "Peso Corporal",
    difficulty: "intermediate",
  },
  {
    id: "kb-swing",
    name: "Swing con Kettlebell",
    muscleGroup: "Cardio",
    secondaryMuscles: ["Glúteos", "Espalda"],
    equipment: "Kettlebell",
    difficulty: "intermediate",
  },
  {
    id: "battle-ropes",
    name: "Cuerdas de Batalla",
    muscleGroup: "Cardio",
    secondaryMuscles: ["Hombros"],
    equipment: "Cardio",
    difficulty: "intermediate",
  },
  {
    id: "box-jump",
    name: "Saltos al Cajón",
    muscleGroup: "Cardio",
    secondaryMuscles: ["Piernas"],
    equipment: "Peso Corporal",
    difficulty: "intermediate",
  },
];

// Group exercises by muscle group for easier filtering
export const EXERCISES_BY_GROUP = EXERCISE_DB.reduce(
  (acc, exercise) => {
    if (!acc[exercise.muscleGroup]) {
      acc[exercise.muscleGroup] = [];
    }
    acc[exercise.muscleGroup].push(exercise);
    return acc;
  },
  {} as Record<MuscleGroup, Exercise[]>,
);

// Get all unique muscle groups
export const MUSCLE_GROUPS: MuscleGroup[] = [
  "Pecho",
  "Espalda",
  "Piernas",
  "Glúteos",
  "Hombros",
  "Bíceps",
  "Tríceps",
  "Abdominales",
  "Cardio",
];
