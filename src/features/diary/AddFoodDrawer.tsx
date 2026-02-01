import { useState, useMemo } from "react";
import { Plus, Search, Flame } from "lucide-react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { CUBAN_FOOD_DB } from "@/lib/data/cubanFoodDb";
import type { FoodItem } from "@/lib/data/cubanFoodDb";
import { cn } from "@/lib/utils";

export function AddFoodDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState<string>("1");
  const [selectedUnit, setSelectedUnit] = useState<string>("g"); // 'g' or custom unit label

  const filteredFoods = useMemo(() => {
    if (!search) return CUBAN_FOOD_DB;
    return CUBAN_FOOD_DB.filter((f) =>
      f.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

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
    // Default to first custom unit if available for easier input (e.g. 1 Cucharon vs 200g)
    if (food.customUnits.length > 0) {
      setSelectedUnit(food.customUnits[0].label);
    } else {
      setSelectedUnit("g");
    }
    setQuantity("1");
    setSearch("");
  };

  const handleAddFood = () => {
    console.log("Adding food:", { ...selectedFood, ...currentStats });
    setIsOpen(false);
    setSelectedFood(null);
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-20 right-4 h-14 w-14 rounded-full shadow-xl bg-primary text-primary-foreground hover:bg-primary/90 z-40 transition-transform active:scale-95"
        >
          <Plus className="h-8 w-8" />
        </Button>
      </DrawerTrigger>

      <DrawerContent className="max-h-[90vh]">
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle className="text-center text-xl font-bold">
              {selectedFood ? selectedFood.name : "Agregar Alimento"}
            </DrawerTitle>
          </DrawerHeader>

          <div className="p-4 pt-0">
            {!selectedFood ? (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar (ej. Congrí, Pollo...)"
                    className="pl-9 bg-muted/50 border-input"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    autoFocus
                  />
                </div>

                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Base de Datos Criolla
                </p>

                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-2">
                    {filteredFoods.map((food) => (
                      <button
                        key={food.id}
                        onClick={() => handleSelectFood(food)}
                        className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border text-left group"
                      >
                        <span className="font-medium group-hover:text-primary transition-colors">
                          {food.name}
                        </span>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Flame className="h-3 w-3 text-orange-500" />
                          <span>{food.caloriesPer100g}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
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
