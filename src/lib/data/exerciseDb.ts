export type MuscleGroup =
  | "Pecho"
  | "Espalda"
  | "Piernas"
  | "Hombros"
  | "Bíceps"
  | "Tríceps"
  | "Abdominales"
  | "Cardio";

export type Equipment =
  | "Barra"
  | "Mancuernas"
  | "Máquina"
  | "Cable"
  | "Peso Corporal"
  | "Cardio";

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  equipment: Equipment;
}

export const EXERCISE_DB: Exercise[] = [
  {
    id: "bench-press",
    name: "Press de Banca Plano",
    muscleGroup: "Pecho",
    equipment: "Barra",
  },
  {
    id: "incline-bench",
    name: "Press Inclinado",
    muscleGroup: "Pecho",
    equipment: "Barra",
  },
  {
    id: "push-up",
    name: "Flexiones (Push-ups)",
    muscleGroup: "Pecho",
    equipment: "Peso Corporal",
  },
  {
    id: "squat",
    name: "Sentadilla (Barra)",
    muscleGroup: "Piernas",
    equipment: "Barra",
  },
  {
    id: "leg-press",
    name: "Prensa de Piernas",
    muscleGroup: "Piernas",
    equipment: "Máquina",
  },
  {
    id: "lunge",
    name: "Zancadas (Lunges)",
    muscleGroup: "Piernas",
    equipment: "Mancuernas",
  },
  {
    id: "deadlift",
    name: "Peso Muerto",
    muscleGroup: "Espalda",
    equipment: "Barra",
  },
  {
    id: "pull-up",
    name: "Dominadas",
    muscleGroup: "Espalda",
    equipment: "Peso Corporal",
  },
  {
    id: "row",
    name: "Remo con Barra",
    muscleGroup: "Espalda",
    equipment: "Barra",
  },
  {
    id: "overhead-press",
    name: "Press Militar",
    muscleGroup: "Hombros",
    equipment: "Barra",
  },
  {
    id: "lateral-raise",
    name: "Elevaciones Laterales",
    muscleGroup: "Hombros",
    equipment: "Mancuernas",
  },
  {
    id: "bicep-curl",
    name: "Curl de Bíceps",
    muscleGroup: "Bíceps",
    equipment: "Mancuernas",
  },
  {
    id: "tricep-extension",
    name: "Extensión de Tríceps",
    muscleGroup: "Tríceps",
    equipment: "Cable",
  },
  {
    id: "plank",
    name: "Plancha Abdominal",
    muscleGroup: "Abdominales",
    equipment: "Peso Corporal",
  },
  { id: "running", name: "Correr", muscleGroup: "Cardio", equipment: "Cardio" },
  {
    id: "jump-rope",
    name: "Saltar Suiza",
    muscleGroup: "Cardio",
    equipment: "Cardio",
  },
];
