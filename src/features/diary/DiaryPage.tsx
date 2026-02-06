import { AddFoodDrawer } from "./AddFoodDrawer";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import {
  Utensils,
  Zap,
  Droplet,
  Coffee,
  Sun,
  Moon,
  Cookie,
  ChevronRight,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/AuthContext";
import { useEffect, useState, useMemo } from "react";
import { DexieAdapter } from "@/lib/storage/dexieAdapter";
import { type UserProfile, db } from "@/lib/storage/db";
import { useLiveQuery } from "dexie-react-hooks";
import type { MealType } from "./AddFoodDrawer";

type MealEntry = {
  id: string;
  foodId: string;
  foodName: string;
  mealType: MealType;
  quantity: number;
  unit: string;
  grams: number;
  calories: number;
  macros: { protein: number; carbs: number; fats: number };
  timestamp: string;
};

export function DiaryPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [addFoodOpen, setAddFoodOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<MealType>("almuerzo");

  useEffect(() => {
    if (user) {
      new DexieAdapter<UserProfile>("profile")
        .getById(user.id)
        .then(setProfile);
    }
  }, [user]);

  // Live Query for Today's Log
  const today = new Date().toISOString().split("T")[0];
  const dailyLog = useLiveQuery(
    () =>
      user ? db.daily_logs.get({ userId: user.id, date: today }) : undefined,
    [user, today],
  );

  const currentCalories = dailyLog?.calories || 0;
  const targetCalories = profile?.tdee || 2000;
  const remaining = Math.max(0, targetCalories - currentCalories);
  const progressPercent = Math.min(
    100,
    (currentCalories / targetCalories) * 100,
  );

  const macros = dailyLog?.macros || { protein: 0, carbs: 0, fats: 0 };
  const targetMacros = profile?.macros || {
    protein: 150,
    carbs: 200,
    fats: 60,
  };

  // Group meals by type
  const mealsByType = useMemo(() => {
    const meals = (dailyLog?.meals as MealEntry[]) || [];
    return {
      desayuno: meals.filter((m) => m.mealType === "desayuno"),
      almuerzo: meals.filter((m) => m.mealType === "almuerzo"),
      merienda: meals.filter((m) => m.mealType === "merienda"),
      cena: meals.filter((m) => m.mealType === "cena"),
    };
  }, [dailyLog?.meals]);

  // Calculate calories per meal
  const mealCalories = useMemo(() => {
    return {
      desayuno: mealsByType.desayuno.reduce((sum, m) => sum + m.calories, 0),
      almuerzo: mealsByType.almuerzo.reduce((sum, m) => sum + m.calories, 0),
      merienda: mealsByType.merienda.reduce((sum, m) => sum + m.calories, 0),
      cena: mealsByType.cena.reduce((sum, m) => sum + m.calories, 0),
    };
  }, [mealsByType]);

  const handleAddToMeal = (meal: MealType) => {
    setSelectedMeal(meal);
    setAddFoodOpen(true);
  };

  return (
    <div className="space-y-6 pb-32">
      {/* Header / Date */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Hoy</h1>
        <span className="text-sm font-medium text-muted-foreground capitalize">
          {new Date().toLocaleDateString("es-ES", {
            weekday: "long",
            day: "numeric",
            month: "short",
          })}
        </span>
      </div>

      {/* Main Summary Card */}
      <Card className="p-6 bg-card border-border shadow-xl relative overflow-hidden ring-1 ring-border/50">
        <div className="relative z-10">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                Calorías Restantes
              </p>
              <h2 className="text-5xl font-black text-foreground tracking-tighter">
                {remaining}
              </h2>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground font-bold uppercase">
                Meta
              </p>
              <p className="font-bold text-foreground text-xl">
                {targetCalories}
              </p>
            </div>
          </div>

          <Progress
            value={progressPercent}
            className="h-4 bg-muted"
            indicatorClassName={cn(
              "shadow-[0_0_15px_rgba(5,150,105,0.4)]",
              progressPercent > 100 ? "bg-red-500" : "bg-primary",
            )}
          />

          <div className="grid grid-cols-3 gap-4 mt-8">
            <MacroStat
              label="Proteína"
              current={macros.protein}
              target={targetMacros.protein}
              color="bg-emerald-500"
              textColor="text-emerald-600 dark:text-emerald-400"
              icon={Utensils}
            />
            <MacroStat
              label="Carbos"
              current={macros.carbs}
              target={targetMacros.carbs}
              color="bg-amber-500"
              textColor="text-amber-600 dark:text-amber-400"
              icon={Zap}
            />
            <MacroStat
              label="Grasa"
              current={macros.fats}
              target={targetMacros.fats}
              color="bg-violet-500"
              textColor="text-violet-600 dark:text-violet-400"
              icon={Droplet}
            />
          </div>
        </div>
      </Card>

      {/* Meal Sections */}
      <div className="space-y-3">
        <MealSection
          title="Desayuno"
          icon={Coffee}
          iconColor="text-orange-500"
          calories={mealCalories.desayuno}
          foods={mealsByType.desayuno}
          onAdd={() => handleAddToMeal("desayuno")}
        />
        <MealSection
          title="Almuerzo"
          icon={Sun}
          iconColor="text-yellow-500"
          calories={mealCalories.almuerzo}
          foods={mealsByType.almuerzo}
          onAdd={() => handleAddToMeal("almuerzo")}
        />
        <MealSection
          title="Merienda"
          icon={Cookie}
          iconColor="text-pink-500"
          calories={mealCalories.merienda}
          foods={mealsByType.merienda}
          onAdd={() => handleAddToMeal("merienda")}
        />
        <MealSection
          title="Cena"
          icon={Moon}
          iconColor="text-indigo-500"
          calories={mealCalories.cena}
          foods={mealsByType.cena}
          onAdd={() => handleAddToMeal("cena")}
        />
      </div>

      {/* FAB with Drawer - Moved up to avoid nav overlap */}
      <AddFoodDrawer
        open={addFoodOpen}
        onOpenChange={setAddFoodOpen}
        defaultMeal={selectedMeal}
      />
    </div>
  );
}

function MacroStat({
  label,
  current,
  target,
  color,
  textColor,
  icon: Icon,
}: {
  label: string;
  current: number;
  target: number;
  color: string;
  textColor: string;
  icon: typeof Utensils;
}) {
  return (
    <div className="flex flex-col gap-2 p-3 rounded-lg bg-muted/30 border border-muted">
      <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
        <Icon className="h-3.5 w-3.5" />
        <span className="text-[10px] uppercase font-black tracking-wider">
          {label}
        </span>
      </div>
      <Progress
        value={(current / target) * 100}
        className="h-1.5 bg-muted-foreground/20"
        indicatorClassName={color}
      />
      <div className="flex justify-between items-baseline mt-1">
        <span className={cn("text-lg font-black", textColor)}>{current}g</span>
        <span className="text-[10px] text-muted-foreground font-bold">
          / {target}
        </span>
      </div>
    </div>
  );
}

function MealSection({
  title,
  icon: Icon,
  iconColor,
  calories,
  foods,
  onAdd,
}: {
  title: string;
  icon: typeof Coffee;
  iconColor: string;
  calories: number;
  foods: MealEntry[];
  onAdd: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card
      className={cn(
        "border-border bg-card transition-all shadow-sm overflow-hidden",
        foods.length > 0 && "ring-1 ring-primary/10",
      )}
    >
      {/* Header - Always Visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex justify-between items-center hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "h-10 w-10 rounded-full bg-muted flex items-center justify-center border border-border/50",
              iconColor,
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-base text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground font-medium">
              {foods.length} Alimento{foods.length !== 1 && "s"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-sm font-bold block text-foreground">
              {calories}
            </span>
            <span className="text-[10px] text-muted-foreground uppercase font-bold">
              Kcal
            </span>
          </div>
          <ChevronRight
            className={cn(
              "h-5 w-5 text-muted-foreground/50 transition-transform",
              expanded && "rotate-90",
            )}
          />
        </div>
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-border/50 bg-muted/20 animate-in slide-in-from-top-2 duration-200">
          {foods.length > 0 ? (
            <div className="divide-y divide-border/30">
              {foods.map((food) => (
                <div
                  key={food.id}
                  className="px-4 py-3 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-sm">{food.foodName}</p>
                    <p className="text-xs text-muted-foreground">
                      {food.quantity} {food.unit} • {food.grams}g
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">{food.calories}</p>
                    <p className="text-[10px] text-muted-foreground">kcal</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-sm text-muted-foreground mb-3">
                No hay alimentos añadidos
              </p>
            </div>
          )}

          {/* Add Food Button inside expanded section */}
          <div className="p-3 border-t border-border/30">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAdd();
              }}
              className="w-full py-2.5 rounded-lg border-2 border-dashed border-muted-foreground/30 text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2 text-sm font-medium"
            >
              <Plus className="h-4 w-4" />
              Añadir a {title}
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}
