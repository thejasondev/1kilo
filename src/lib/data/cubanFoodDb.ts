export type UnitConversion = {
  label: string;
  ratio: number; // multiplier to convert to grams
};

export type FoodCategory =
  | "proteina"
  | "carbohidrato"
  | "vianda"
  | "vegetal"
  | "fruta"
  | "lacteo"
  | "bebida"
  | "dulce"
  | "otro";

export type FoodItem = {
  id: string;
  name: string;
  category: FoodCategory;
  caloriesPer100g: number;
  macrosPer100g: {
    protein: number;
    carbs: number;
    fat: number;
  };
  customUnits: UnitConversion[];
};

export const CUBAN_FOOD_DB: FoodItem[] = [
  // === PROTEÍNAS ===
  {
    id: "pollo-muslo",
    name: "Muslo de Pollo (Asado)",
    category: "proteina",
    caloriesPer100g: 180,
    macrosPer100g: { protein: 24, carbs: 0, fat: 10 },
    customUnits: [
      { label: "Muslo Mediano", ratio: 120 },
      { label: "Muslo Grande", ratio: 180 },
    ],
  },
  {
    id: "pollo-pechuga",
    name: "Pechuga de Pollo",
    category: "proteina",
    caloriesPer100g: 165,
    macrosPer100g: { protein: 31, carbs: 0, fat: 3.6 },
    customUnits: [
      { label: "Pechuga Mediana", ratio: 170 },
      { label: "Filete", ratio: 100 },
    ],
  },
  {
    id: "cerdo-bistec",
    name: "Bistec de Cerdo",
    category: "proteina",
    caloriesPer100g: 242,
    macrosPer100g: { protein: 27, carbs: 0, fat: 14 },
    customUnits: [
      { label: "Bistec Mediano", ratio: 150 },
      { label: "Porción", ratio: 100 },
    ],
  },
  {
    id: "cerdo-masas-fritas",
    name: "Masas de Cerdo Fritas",
    category: "proteina",
    caloriesPer100g: 320,
    macrosPer100g: { protein: 22, carbs: 5, fat: 24 },
    customUnits: [
      { label: "Porción", ratio: 150 },
      { label: "Trozo Grande", ratio: 80 },
    ],
  },
  {
    id: "carne-res",
    name: "Carne de Res (Bistec)",
    category: "proteina",
    caloriesPer100g: 250,
    macrosPer100g: { protein: 26, carbs: 0, fat: 15 },
    customUnits: [{ label: "Bistec", ratio: 150 }],
  },
  {
    id: "picadillo-soya",
    name: "Picadillo de Soya",
    category: "proteina",
    caloriesPer100g: 120,
    macrosPer100g: { protein: 12, carbs: 8, fat: 6 },
    customUnits: [
      { label: "Cucharón", ratio: 150 },
      { label: "Cucharada", ratio: 20 },
    ],
  },
  {
    id: "huevo-frito",
    name: "Huevo Frito",
    category: "proteina",
    caloriesPer100g: 196,
    macrosPer100g: { protein: 14, carbs: 1, fat: 15 },
    customUnits: [{ label: "Unidad", ratio: 50 }],
  },
  {
    id: "huevo-hervido",
    name: "Huevo Hervido",
    category: "proteina",
    caloriesPer100g: 155,
    macrosPer100g: { protein: 13, carbs: 1, fat: 11 },
    customUnits: [{ label: "Unidad", ratio: 50 }],
  },
  {
    id: "huevo-revuelto",
    name: "Huevo Revuelto",
    category: "proteina",
    caloriesPer100g: 170,
    macrosPer100g: { protein: 11, carbs: 2, fat: 13 },
    customUnits: [{ label: "Porción (2 huevos)", ratio: 100 }],
  },
  {
    id: "pescado-frito",
    name: "Pescado Frito",
    category: "proteina",
    caloriesPer100g: 200,
    macrosPer100g: { protein: 22, carbs: 8, fat: 10 },
    customUnits: [
      { label: "Filete", ratio: 150 },
      { label: "Porción", ratio: 100 },
    ],
  },
  {
    id: "camarones",
    name: "Camarones (Enchilados)",
    category: "proteina",
    caloriesPer100g: 110,
    macrosPer100g: { protein: 20, carbs: 3, fat: 2 },
    customUnits: [{ label: "Porción", ratio: 120 }],
  },
  {
    id: "jamon",
    name: "Jamón (de sandwich)",
    category: "proteina",
    caloriesPer100g: 145,
    macrosPer100g: { protein: 21, carbs: 1, fat: 6 },
    customUnits: [
      { label: "Lasca", ratio: 20 },
      { label: "Paquete", ratio: 100 },
    ],
  },

  // === CARBOHIDRATOS / GRANOS ===
  {
    id: "arroz-blanco",
    name: "Arroz Blanco (Cocido)",
    category: "carbohidrato",
    caloriesPer100g: 130,
    macrosPer100g: { protein: 2.7, carbs: 28, fat: 0.3 },
    customUnits: [
      { label: "Cucharón", ratio: 200 },
      { label: "Taza", ratio: 158 },
    ],
  },
  {
    id: "arroz-congri",
    name: "Arroz Congrí",
    category: "carbohidrato",
    caloriesPer100g: 165,
    macrosPer100g: { protein: 6, carbs: 28, fat: 4 },
    customUnits: [
      { label: "Cucharón", ratio: 200 },
      { label: "Plato Raso", ratio: 350 },
    ],
  },
  {
    id: "arroz-amarillo",
    name: "Arroz Amarillo",
    category: "carbohidrato",
    caloriesPer100g: 145,
    macrosPer100g: { protein: 3, carbs: 30, fat: 2 },
    customUnits: [{ label: "Cucharón", ratio: 200 }],
  },
  {
    id: "frijoles-negros",
    name: "Frijoles Negros (Potaje)",
    category: "carbohidrato",
    caloriesPer100g: 110,
    macrosPer100g: { protein: 6, carbs: 20, fat: 1 },
    customUnits: [{ label: "Cucharón", ratio: 220 }],
  },
  {
    id: "frijoles-colorados",
    name: "Frijoles Colorados",
    category: "carbohidrato",
    caloriesPer100g: 120,
    macrosPer100g: { protein: 7, carbs: 22, fat: 1 },
    customUnits: [{ label: "Cucharón", ratio: 220 }],
  },
  {
    id: "chícharos",
    name: "Chícharos (Potaje)",
    category: "carbohidrato",
    caloriesPer100g: 100,
    macrosPer100g: { protein: 7, carbs: 18, fat: 0.5 },
    customUnits: [{ label: "Cucharón", ratio: 220 }],
  },
  {
    id: "pan-bodega",
    name: "Pan de la Bodega",
    category: "carbohidrato",
    caloriesPer100g: 260,
    macrosPer100g: { protein: 8, carbs: 50, fat: 3 },
    customUnits: [
      { label: "Unidad", ratio: 80 },
      { label: "Mitad", ratio: 40 },
    ],
  },
  {
    id: "pan-suave",
    name: "Pan Suave (de Panadería)",
    category: "carbohidrato",
    caloriesPer100g: 280,
    macrosPer100g: { protein: 8, carbs: 52, fat: 4 },
    customUnits: [{ label: "Unidad", ratio: 60 }],
  },
  {
    id: "galletas-sal",
    name: "Galletas de Sal",
    category: "carbohidrato",
    caloriesPer100g: 450,
    macrosPer100g: { protein: 8, carbs: 60, fat: 20 },
    customUnits: [
      { label: "Galleta", ratio: 10 },
      { label: "Paquete", ratio: 120 },
    ],
  },
  {
    id: "espaguetis",
    name: "Espaguetis (Cocidos)",
    category: "carbohidrato",
    caloriesPer100g: 155,
    macrosPer100g: { protein: 5, carbs: 32, fat: 1 },
    customUnits: [
      { label: "Plato", ratio: 200 },
      { label: "Porción", ratio: 150 },
    ],
  },
  {
    id: "coditos",
    name: "Coditos con Salsa",
    category: "carbohidrato",
    caloriesPer100g: 180,
    macrosPer100g: { protein: 6, carbs: 30, fat: 5 },
    customUnits: [{ label: "Plato", ratio: 250 }],
  },

  // === VIANDAS / TUBÉRCULOS ===
  {
    id: "malanga-hervida",
    name: "Malanga Hervida",
    category: "vianda",
    caloriesPer100g: 140,
    macrosPer100g: { protein: 1, carbs: 34, fat: 0 },
    customUnits: [
      { label: "Trozo Mediano", ratio: 100 },
      { label: "Plato", ratio: 200 },
    ],
  },
  {
    id: "yuca-hervida",
    name: "Yuca Hervida",
    category: "vianda",
    caloriesPer100g: 160,
    macrosPer100g: { protein: 1, carbs: 38, fat: 0.3 },
    customUnits: [
      { label: "Trozo", ratio: 100 },
      { label: "Porción", ratio: 150 },
    ],
  },
  {
    id: "yuca-frita",
    name: "Yuca Frita",
    category: "vianda",
    caloriesPer100g: 260,
    macrosPer100g: { protein: 1, carbs: 35, fat: 13 },
    customUnits: [{ label: "Porción", ratio: 120 }],
  },
  {
    id: "papa-hervida",
    name: "Papa Hervida",
    category: "vianda",
    caloriesPer100g: 87,
    macrosPer100g: { protein: 2, carbs: 20, fat: 0 },
    customUnits: [
      { label: "Papa Mediana", ratio: 150 },
      { label: "Porción", ratio: 100 },
    ],
  },
  {
    id: "papa-frita",
    name: "Papas Fritas",
    category: "vianda",
    caloriesPer100g: 312,
    macrosPer100g: { protein: 3, carbs: 41, fat: 15 },
    customUnits: [{ label: "Porción", ratio: 100 }],
  },
  {
    id: "boniato-hervido",
    name: "Boniato Hervido",
    category: "vianda",
    caloriesPer100g: 90,
    macrosPer100g: { protein: 1.5, carbs: 21, fat: 0 },
    customUnits: [{ label: "Trozo", ratio: 120 }],
  },
  {
    id: "platano-maduro-frito",
    name: "Plátano Maduro Frito",
    category: "vianda",
    caloriesPer100g: 280,
    macrosPer100g: { protein: 1, carbs: 40, fat: 14 },
    customUnits: [
      { label: "Rueda", ratio: 30 },
      { label: "Plátano", ratio: 200 },
    ],
  },
  {
    id: "platano-verde-frito",
    name: "Chatinos / Tostones",
    category: "vianda",
    caloriesPer100g: 300,
    macrosPer100g: { protein: 1, carbs: 38, fat: 16 },
    customUnits: [{ label: "Porción (6 uds)", ratio: 100 }],
  },
  {
    id: "platano-hervido",
    name: "Plátano Burro Hervido",
    category: "vianda",
    caloriesPer100g: 120,
    macrosPer100g: { protein: 1, carbs: 30, fat: 0 },
    customUnits: [{ label: "Unidad", ratio: 150 }],
  },

  // === VEGETALES / ENSALADAS ===
  {
    id: "ensalada-col",
    name: "Ensalada de Col",
    category: "vegetal",
    caloriesPer100g: 25,
    macrosPer100g: { protein: 1, carbs: 5, fat: 0 },
    customUnits: [{ label: "Taza", ratio: 90 }],
  },
  {
    id: "tomate",
    name: "Tomate",
    category: "vegetal",
    caloriesPer100g: 18,
    macrosPer100g: { protein: 1, carbs: 4, fat: 0 },
    customUnits: [
      { label: "Tomate Mediano", ratio: 120 },
      { label: "Rueda", ratio: 20 },
    ],
  },
  {
    id: "pepino",
    name: "Pepino",
    category: "vegetal",
    caloriesPer100g: 15,
    macrosPer100g: { protein: 0.5, carbs: 3, fat: 0 },
    customUnits: [{ label: "Pepino Mediano", ratio: 200 }],
  },
  {
    id: "aguacate",
    name: "Aguacate",
    category: "vegetal",
    caloriesPer100g: 160,
    macrosPer100g: { protein: 2, carbs: 9, fat: 15 },
    customUnits: [
      { label: "Lasca", ratio: 30 },
      { label: "Mitad", ratio: 150 },
    ],
  },
  {
    id: "lechuga",
    name: "Lechuga",
    category: "vegetal",
    caloriesPer100g: 15,
    macrosPer100g: { protein: 1, carbs: 2, fat: 0 },
    customUnits: [{ label: "Taza", ratio: 50 }],
  },
  {
    id: "calabaza",
    name: "Calabaza Hervida",
    category: "vegetal",
    caloriesPer100g: 26,
    macrosPer100g: { protein: 1, carbs: 6, fat: 0 },
    customUnits: [{ label: "Porción", ratio: 100 }],
  },
  {
    id: "chayote",
    name: "Chayote Hervido",
    category: "vegetal",
    caloriesPer100g: 19,
    macrosPer100g: { protein: 0.8, carbs: 4, fat: 0 },
    customUnits: [{ label: "Mitad", ratio: 100 }],
  },
  {
    id: "quimbombo",
    name: "Quimbombó Guisado",
    category: "vegetal",
    caloriesPer100g: 35,
    macrosPer100g: { protein: 2, carbs: 7, fat: 0.2 },
    customUnits: [{ label: "Cucharón", ratio: 150 }],
  },

  // === FRUTAS ===
  {
    id: "platano-fruta",
    name: "Plátano Fruta",
    category: "fruta",
    caloriesPer100g: 89,
    macrosPer100g: { protein: 1, carbs: 23, fat: 0.3 },
    customUnits: [{ label: "Unidad", ratio: 120 }],
  },
  {
    id: "mango",
    name: "Mango",
    category: "fruta",
    caloriesPer100g: 60,
    macrosPer100g: { protein: 0.8, carbs: 15, fat: 0.4 },
    customUnits: [
      { label: "Mango Mediano", ratio: 200 },
      { label: "Taza (cubos)", ratio: 165 },
    ],
  },
  {
    id: "papaya",
    name: "Papaya (Fruta Bomba)",
    category: "fruta",
    caloriesPer100g: 43,
    macrosPer100g: { protein: 0.5, carbs: 11, fat: 0.3 },
    customUnits: [{ label: "Taza", ratio: 140 }],
  },
  {
    id: "guayaba",
    name: "Guayaba",
    category: "fruta",
    caloriesPer100g: 68,
    macrosPer100g: { protein: 2.5, carbs: 14, fat: 1 },
    customUnits: [{ label: "Unidad", ratio: 55 }],
  },
  {
    id: "piña",
    name: "Piña",
    category: "fruta",
    caloriesPer100g: 50,
    macrosPer100g: { protein: 0.5, carbs: 13, fat: 0 },
    customUnits: [
      { label: "Rueda", ratio: 84 },
      { label: "Taza", ratio: 165 },
    ],
  },
  {
    id: "naranja",
    name: "Naranja",
    category: "fruta",
    caloriesPer100g: 47,
    macrosPer100g: { protein: 1, carbs: 12, fat: 0 },
    customUnits: [{ label: "Unidad", ratio: 130 }],
  },
  {
    id: "mamey",
    name: "Mamey",
    category: "fruta",
    caloriesPer100g: 124,
    macrosPer100g: { protein: 1.5, carbs: 32, fat: 0.5 },
    customUnits: [{ label: "Porción", ratio: 100 }],
  },

  // === LÁCTEOS ===
  {
    id: "leche-entera",
    name: "Leche Entera",
    category: "lacteo",
    caloriesPer100g: 60,
    macrosPer100g: { protein: 3, carbs: 5, fat: 3 },
    customUnits: [
      { label: "Vaso", ratio: 240 },
      { label: "Taza", ratio: 200 },
    ],
  },
  {
    id: "yogurt",
    name: "Yogurt Natural",
    category: "lacteo",
    caloriesPer100g: 60,
    macrosPer100g: { protein: 3.5, carbs: 5, fat: 3 },
    customUnits: [{ label: "Vaso", ratio: 200 }],
  },
  {
    id: "queso-blanco",
    name: "Queso Blanco",
    category: "lacteo",
    caloriesPer100g: 300,
    macrosPer100g: { protein: 20, carbs: 1, fat: 24 },
    customUnits: [
      { label: "Lasca", ratio: 30 },
      { label: "Porción", ratio: 50 },
    ],
  },
  {
    id: "queso-amarillo",
    name: "Queso Amarillo (Gouda)",
    category: "lacteo",
    caloriesPer100g: 356,
    macrosPer100g: { protein: 25, carbs: 2, fat: 27 },
    customUnits: [{ label: "Lasca", ratio: 20 }],
  },

  // === BEBIDAS ===
  {
    id: "cafe-azucar",
    name: "Café con Azúcar",
    category: "bebida",
    caloriesPer100g: 30,
    macrosPer100g: { protein: 0.3, carbs: 7, fat: 0 },
    customUnits: [
      { label: "Tacita", ratio: 50 },
      { label: "Taza", ratio: 100 },
    ],
  },
  {
    id: "refresco",
    name: "Refresco Gaseado",
    category: "bebida",
    caloriesPer100g: 42,
    macrosPer100g: { protein: 0, carbs: 11, fat: 0 },
    customUnits: [
      { label: "Lata", ratio: 355 },
      { label: "Vaso", ratio: 250 },
    ],
  },
  {
    id: "jugo-natural",
    name: "Jugo Natural (sin azúcar)",
    category: "bebida",
    caloriesPer100g: 45,
    macrosPer100g: { protein: 0.5, carbs: 11, fat: 0 },
    customUnits: [{ label: "Vaso", ratio: 250 }],
  },
  {
    id: "limonada",
    name: "Limonada con Azúcar",
    category: "bebida",
    caloriesPer100g: 40,
    macrosPer100g: { protein: 0, carbs: 10, fat: 0 },
    customUnits: [{ label: "Vaso", ratio: 250 }],
  },
  {
    id: "cerveza",
    name: "Cerveza",
    category: "bebida",
    caloriesPer100g: 43,
    macrosPer100g: { protein: 0.5, carbs: 4, fat: 0 },
    customUnits: [
      { label: "Lata", ratio: 355 },
      { label: "Botella", ratio: 500 },
    ],
  },

  // === DULCES / POSTRES ===
  {
    id: "flan",
    name: "Flan de Leche",
    category: "dulce",
    caloriesPer100g: 200,
    macrosPer100g: { protein: 5, carbs: 30, fat: 7 },
    customUnits: [{ label: "Porción", ratio: 100 }],
  },
  {
    id: "arroz-con-leche",
    name: "Arroz con Leche",
    category: "dulce",
    caloriesPer100g: 130,
    macrosPer100g: { protein: 3, carbs: 22, fat: 3 },
    customUnits: [{ label: "Taza", ratio: 150 }],
  },
  {
    id: "natilla",
    name: "Natilla",
    category: "dulce",
    caloriesPer100g: 150,
    macrosPer100g: { protein: 3, carbs: 24, fat: 5 },
    customUnits: [{ label: "Vasito", ratio: 100 }],
  },
  {
    id: "helado",
    name: "Helado",
    category: "dulce",
    caloriesPer100g: 200,
    macrosPer100g: { protein: 3, carbs: 24, fat: 11 },
    customUnits: [
      { label: "Bola", ratio: 70 },
      { label: "Barquilla", ratio: 100 },
    ],
  },
  {
    id: "coquito",
    name: "Coquito Acaramelado",
    category: "dulce",
    caloriesPer100g: 450,
    macrosPer100g: { protein: 5, carbs: 55, fat: 24 },
    customUnits: [{ label: "Unidad", ratio: 40 }],
  },
  {
    id: "mermelada",
    name: "Mermelada de Guayaba",
    category: "dulce",
    caloriesPer100g: 260,
    macrosPer100g: { protein: 0.3, carbs: 65, fat: 0 },
    customUnits: [
      { label: "Cucharada", ratio: 20 },
      { label: "Barra", ratio: 250 },
    ],
  },

  // === OTROS / PREPARACIONES ===
  {
    id: "aceite",
    name: "Aceite de Cocina",
    category: "otro",
    caloriesPer100g: 884,
    macrosPer100g: { protein: 0, carbs: 0, fat: 100 },
    customUnits: [
      { label: "Cucharada", ratio: 14 },
      { label: "Cucharadita", ratio: 5 },
    ],
  },
  {
    id: "mayonesa",
    name: "Mayonesa",
    category: "otro",
    caloriesPer100g: 680,
    macrosPer100g: { protein: 1, carbs: 1, fat: 75 },
    customUnits: [{ label: "Cucharada", ratio: 15 }],
  },
  {
    id: "azucar",
    name: "Azúcar",
    category: "otro",
    caloriesPer100g: 400,
    macrosPer100g: { protein: 0, carbs: 100, fat: 0 },
    customUnits: [
      { label: "Cucharadita", ratio: 4 },
      { label: "Cucharada", ratio: 12 },
    ],
  },
  {
    id: "pizza",
    name: "Pizza (Casera)",
    category: "otro",
    caloriesPer100g: 266,
    macrosPer100g: { protein: 11, carbs: 33, fat: 10 },
    customUnits: [
      { label: "Porción", ratio: 100 },
      { label: "Pizza Completa", ratio: 400 },
    ],
  },
  {
    id: "croquetas",
    name: "Croquetas",
    category: "otro",
    caloriesPer100g: 290,
    macrosPer100g: { protein: 8, carbs: 25, fat: 18 },
    customUnits: [
      { label: "Unidad", ratio: 30 },
      { label: "Porción (5 uds)", ratio: 150 },
    ],
  },
  {
    id: "empanada",
    name: "Empanada de Carne",
    category: "otro",
    caloriesPer100g: 300,
    macrosPer100g: { protein: 10, carbs: 28, fat: 17 },
    customUnits: [{ label: "Unidad", ratio: 120 }],
  },
  {
    id: "sandwich",
    name: "Sandwich de Jamón y Queso",
    category: "otro",
    caloriesPer100g: 280,
    macrosPer100g: { protein: 14, carbs: 28, fat: 13 },
    customUnits: [{ label: "Unidad", ratio: 150 }],
  },
];

// Helper to get foods by category
export function getFoodsByCategory(category: FoodCategory): FoodItem[] {
  return CUBAN_FOOD_DB.filter((food) => food.category === category);
}

// Category labels in Spanish
export const FOOD_CATEGORIES: { value: FoodCategory; label: string }[] = [
  { value: "proteina", label: "Proteínas" },
  { value: "carbohidrato", label: "Carbohidratos" },
  { value: "vianda", label: "Viandas" },
  { value: "vegetal", label: "Vegetales" },
  { value: "fruta", label: "Frutas" },
  { value: "lacteo", label: "Lácteos" },
  { value: "bebida", label: "Bebidas" },
  { value: "dulce", label: "Dulces" },
  { value: "otro", label: "Otros" },
];
