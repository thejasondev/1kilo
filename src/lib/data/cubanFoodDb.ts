export type UnitConversion = {
  label: string;
  ratio: number; // multiplier to convert to grams
};

export type FoodItem = {
  id: string;
  name: string;
  caloriesPer100g: number;
  macrosPer100g: {
    protein: number;
    carbs: number;
    fat: number;
  };
  customUnits: UnitConversion[]; // e.g. "Cucharón"
};

export const CUBAN_FOOD_DB: FoodItem[] = [
  {
    id: "arroz-congri",
    name: "Arroz Congrí",
    caloriesPer100g: 165,
    macrosPer100g: { protein: 6, carbs: 28, fat: 4 },
    customUnits: [
      { label: "Cucharón", ratio: 200 },
      { label: "Plato Raso", ratio: 350 },
    ],
  },
  {
    id: "picadillo-soya",
    name: "Picadillo de Soya",
    caloriesPer100g: 120, // Aprox, depende de la grasa agregada
    macrosPer100g: { protein: 12, carbs: 8, fat: 6 },
    customUnits: [
      { label: "Cucharón", ratio: 150 },
      { label: "Cucharada", ratio: 20 },
    ],
  },
  {
    id: "pollo-muslo",
    name: "Muslo de Pollo (Asado)",
    caloriesPer100g: 180,
    macrosPer100g: { protein: 24, carbs: 0, fat: 10 },
    customUnits: [
      { label: "Muslo Mediano", ratio: 120 }, // Parte comestible aprox
      { label: "Muslo Grande", ratio: 180 },
    ],
  },
  {
    id: "malanga-hervida",
    name: "Malanga Hervida",
    caloriesPer100g: 140,
    macrosPer100g: { protein: 1, carbs: 34, fat: 0 },
    customUnits: [
      { label: "Trozo Mediano", ratio: 100 },
      { label: "Plato Pequeño", ratio: 200 },
    ],
  },
  {
    id: "pan-bodega",
    name: "Pan de la Bodega",
    caloriesPer100g: 260,
    macrosPer100g: { protein: 8, carbs: 50, fat: 3 },
    customUnits: [
      { label: "Unidad (Pan suave)", ratio: 80 }, // Aprox 80g el pan de cuota
      { label: "Mitad", ratio: 40 },
    ],
  },
  {
    id: "huevo-frito",
    name: "Huevo Frito",
    caloriesPer100g: 196,
    macrosPer100g: { protein: 14, carbs: 1, fat: 15 },
    customUnits: [{ label: "Unidad", ratio: 50 }],
  },
  {
    id: "huevo-hervido",
    name: "Huevo Hervido",
    caloriesPer100g: 155,
    macrosPer100g: { protein: 13, carbs: 1, fat: 11 },
    customUnits: [{ label: "Unidad", ratio: 50 }],
  },
  {
    id: "arroz-blanco",
    name: "Arroz Blanco (Cocido)",
    caloriesPer100g: 130,
    macrosPer100g: { protein: 2.7, carbs: 28, fat: 0.3 },
    customUnits: [
      { label: "Cucharón", ratio: 200 },
      { label: "Taza", ratio: 158 },
    ],
  },
  {
    id: "frijoles-negros",
    name: "Frijoles Negros (Potaje)",
    caloriesPer100g: 110,
    macrosPer100g: { protein: 6, carbs: 20, fat: 1 },
    customUnits: [{ label: "Cucharón", ratio: 220 }],
  },
  {
    id: "aguacate",
    name: "Aguacate",
    caloriesPer100g: 160,
    macrosPer100g: { protein: 2, carbs: 9, fat: 15 },
    customUnits: [
      { label: "lasca", ratio: 30 },
      { label: "Mitad Media", ratio: 150 },
    ],
  },
];
