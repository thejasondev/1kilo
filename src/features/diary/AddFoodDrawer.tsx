import { useState, useMemo, useEffect } from "react";
import { Plus, Search, Flame, Coffee, Sun, Moon, Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CUBAN_FOOD_DB, FOOD_CATEGORIES } from "@/lib/data/cubanFoodDb";
import type { FoodItem, FoodCategory } from "@/lib/data/cubanFoodDb";
import { cn } from "@/lib/utils";
import { db } from "@/lib/storage/db";
import { useAuth } from "@/features/auth/AuthContext";
import { Badge } from "@/components/ui/badge";

export type MealType = "desayuno" | "almuerzo" | "cena" | "merienda";

const MEAL_TYPES: { value: MealType; label: string; icon: typeof Coffee }[] = [
  { value: "desayuno", label: "Desayuno", icon: Coffee },
  { value: "almuerzo", label: "Almuerzo", icon: Sun },
  { value: "merienda", label: "Merienda", icon: Cookie },
  { value: "cena", label: "Cena", icon: Moon },
];

interface AddFoodDrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultMeal?: MealType;
}

export function AddFoodDrawer({
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
  defaultMeal = "almuerzo",
}: AddFoodDrawerProps) {
  const { user } = useAuth();
  const [internalOpen, setInternalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    FoodCategory | "all"
  >("all");
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState<string>("1");
  const [selectedUnit, setSelectedUnit] = useState<string>("g");
  const [mealType, setMealType] = useState<MealType>(defaultMeal);

  // Sync with external open state
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const setIsOpen = externalOnOpenChange || setInternalOpen;

  // Update meal type when defaultMeal changes (from parent)
  useEffect(() => {
    setMealType(defaultMeal);
  }, [defaultMeal]);

  const filteredFoods = useMemo(() => {
    let foods = CUBAN_FOOD_DB;

    if (selectedCategory !== "all") {
      foods = foods.filter((f) => f.category === selectedCategory);
    }

    if (search) {
      foods = foods.filter((f) =>
        f.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return foods;
  }, [search, selectedCategory]);

  // Calculate stats based on selection
  const currentStats = useMemo(() => {
    if (!selectedFood) return null;

    let grams = 0;
    if (selectedUnit === "g") {
      grams = parseFloat(quantity) || 0;
    } else {
      const unit = selectedFood.customUnits.find(
        (u) => u.label === selectedUnit,
      );
      if (unit) {
        grams = (parseFloat(quantity) || 0) * unit.ratio;
      }
    }

    const ratio = grams / 100;
    return {
      calories: Math.round(selectedFood.caloriesPer100g * ratio),
      protein: Math.round(selectedFood.macrosPer100g.protein * ratio),
      carbs: Math.round(selectedFood.macrosPer100g.carbs * ratio),
      fat: Math.round(selectedFood.macrosPer100g.fat * ratio),
      grams: Math.round(grams),
    };
  }, [selectedFood, quantity, selectedUnit]);

  const handleSelectFood = (food: FoodItem) => {
    setSelectedFood(food);
    if (food.customUnits.length > 0) {
      setSelectedUnit(food.customUnits[0].label);
    } else {
      setSelectedUnit("g");
    }
    setQuantity("1");
    setSearch("");
  };

  const handleAddFood = async () => {
    if (!user || !selectedFood || !currentStats) return;

    const today = new Date().toISOString().split("T")[0];

    // Get or create today's log
    const existingLog = await db.daily_logs.get({
      userId: user.id,
      date: today,
    });

    const dailyLog = existingLog ?? {
      userId: user.id,
      date: today,
      calories: 0,
      macros: { protein: 0, carbs: 0, fats: 0 },
      meals: [],
    };

    // Add the new food entry
    const newEntry = {
      id: crypto.randomUUID(),
      foodId: selectedFood.id,
      foodName: selectedFood.name,
      mealType,
      quantity: parseFloat(quantity),
      unit: selectedUnit,
      grams: currentStats.grams,
      calories: currentStats.calories,
      macros: {
        protein: currentStats.protein,
        carbs: currentStats.carbs,
        fats: currentStats.fat,
      },
      timestamp: new Date().toISOString(),
    };

    dailyLog.meals.push(newEntry);

    // Update totals
    dailyLog.calories += currentStats.calories;
    dailyLog.macros.protein += currentStats.protein;
    dailyLog.macros.carbs += currentStats.carbs;
    dailyLog.macros.fats += currentStats.fat;

    // Save to DB
    await db.daily_logs.put(dailyLog);

    // Reset and close
    setIsOpen(false);
    setSelectedFood(null);
    setSearch("");
    setSelectedCategory("all");
  };

  const resetAndClose = () => {
    setSelectedFood(null);
    setSearch("");
    setSelectedCategory("all");
  };

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) resetAndClose();
      }}
    >
      {/* FAB Trigger - Only show if not controlled externally */}
      {externalOpen === undefined && (
        <DrawerTrigger asChild>
          <Button
            size="icon"
            className="fixed bottom-24 right-4 h-14 w-14 rounded-full shadow-xl bg-primary text-primary-foreground hover:bg-primary/90 z-40 transition-transform active:scale-95"
          >
            <Plus className="h-8 w-8" />
          </Button>
        </DrawerTrigger>
      )}

      <DrawerContent className="max-h-[90vh]">
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader className="pb-2">
            <DrawerTitle className="text-center text-xl font-bold">
              {selectedFood ? selectedFood.name : "Agregar Alimento"}
            </DrawerTitle>
          </DrawerHeader>

          <div className="p-4 pt-0">
            {!selectedFood ? (
              <div className="space-y-4">
                {/* Meal Type Selector - Improved */}
                <div className="flex gap-1.5 p-1 bg-muted/50 rounded-lg">
                  {MEAL_TYPES.map((meal) => {
                    const Icon = meal.icon;
                    return (
                      <button
                        key={meal.value}
                        onClick={() => setMealType(meal.value)}
                        className={cn(
                          "flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-md transition-all text-xs font-medium",
                          mealType === meal.value
                            ? "bg-background shadow-sm text-foreground"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="truncate max-w-full">
                          {meal.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar (ej. Congrí, Pollo...)"
                    className="pl-9 bg-muted/50 border-input h-11"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    autoFocus
                  />
                </div>

                {/* Category Filter - Improved with Badges */}
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                  <Badge
                    variant={selectedCategory === "all" ? "default" : "outline"}
                    className="shrink-0 cursor-pointer py-1.5 px-3"
                    onClick={() => setSelectedCategory("all")}
                  >
                    Todos
                  </Badge>
                  {FOOD_CATEGORIES.map((cat) => (
                    <Badge
                      key={cat.value}
                      variant={
                        selectedCategory === cat.value ? "default" : "outline"
                      }
                      className="shrink-0 cursor-pointer py-1.5 px-3 whitespace-nowrap"
                      onClick={() => setSelectedCategory(cat.value)}
                    >
                      {cat.label}
                    </Badge>
                  ))}
                </div>

                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {filteredFoods.length} alimentos
                </p>

                {/* Food List with proper scroll */}
                <div className="h-[280px] overflow-y-auto overscroll-contain space-y-1 pr-1">
                  {filteredFoods.map((food) => (
                    <button
                      key={food.id}
                      onClick={() => handleSelectFood(food)}
                      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border text-left group"
                    >
                      <div className="min-w-0 flex-1">
                        <span className="font-medium group-hover:text-primary transition-colors block truncate">
                          {food.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase">
                          {
                            FOOD_CATEGORIES.find(
                              (c) => c.value === food.category,
                            )?.label
                          }
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground shrink-0 ml-2">
                        <Flame className="h-3 w-3 text-orange-500" />
                        <span>{food.caloriesPer100g}</span>
                      </div>
                    </button>
                  ))}
                  {filteredFoods.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No se encontraron alimentos
                    </p>
                  )}
                </div>
              </div>
            ) : (
              // Step 2: Quantity Input
              <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                <div className="flex gap-4 items-end">
                  <div className="flex-1 space-y-2">
                    <Label className="text-xs uppercase text-muted-foreground">
                      Cantidad
                    </Label>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="text-lg font-bold h-12"
                      inputMode="decimal"
                    />
                  </div>

                  <div className="w-[140px] space-y-2">
                    <Label className="text-xs uppercase text-muted-foreground">
                      Unidad
                    </Label>
                    <Select
                      value={selectedUnit}
                      onValueChange={setSelectedUnit}
                    >
                      <SelectTrigger className="h-12 bg-muted/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="g">Gramos (g)</SelectItem>
                        {selectedFood.customUnits.map((u) => (
                          <SelectItem key={u.label} value={u.label}>
                            {u.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Meal Type Badge - Clickable to change */}
                <div className="flex items-center justify-center gap-2 text-sm bg-muted/30 rounded-lg py-3 px-4">
                  <span className="text-muted-foreground">Agregando a:</span>
                  <Select
                    value={mealType}
                    onValueChange={(v) => setMealType(v as MealType)}
                  >
                    <SelectTrigger className="w-auto h-auto border-0 bg-transparent p-0 font-bold text-foreground gap-1 focus:ring-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MEAL_TYPES.map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Live Stats Preview */}
                <div className="grid grid-cols-4 gap-2 py-4 rounded-xl bg-muted/30 border border-border/50">
                  <StatBox
                    label="Kcal"
                    value={currentStats?.calories}
                    color="text-orange-500"
                  />
                  <StatBox
                    label="Prot"
                    value={currentStats?.protein}
                    unit="g"
                  />
                  <StatBox label="Carbs" value={currentStats?.carbs} unit="g" />
                  <StatBox label="Grasa" value={currentStats?.fat} unit="g" />
                </div>

                <div className="pt-2 flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setSelectedFood(null)}
                  >
                    Atrás
                  </Button>
                  <Button
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
                    onClick={handleAddFood}
                  >
                    Agregar +
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function StatBox({
  label,
  value,
  unit = "",
  color,
}: {
  label: string;
  value?: number;
  unit?: string;
  color?: string;
}) {
  return (
    <div className="flex flex-col items-center p-2">
      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
      <span className={cn("text-lg font-black tracking-tight", color)}>
        {value || 0}
        <span className="text-xs font-normal text-muted-foreground ml-0.5">
          {unit}
        </span>
      </span>
    </div>
  );
}
