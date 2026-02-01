import { AddFoodDrawer } from "./AddFoodDrawer";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Utensils, Zap, Leaf, Droplet } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/AuthContext";
import { useEffect, useState } from "react";
import { DexieAdapter } from "@/lib/storage/dexieAdapter";
import { type UserProfile, db } from "@/lib/storage/db";
import { useLiveQuery } from "dexie-react-hooks";

export function DiaryPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);

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
  // Use `tdee` for maintenance, or calculate target based on goal.
  // Ideally `profile` has `targetCalories` stored if we updated the interface correctly,
  // or we use `tdee`. Let's assume tdee for now or 2000 fallback.
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

  return (
    <div className="space-y-6 pb-24">
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

      {/* Meal Sections - Mock Data for visual structure still, since DB daily_logs.foods structure isn't fully defined/populated yet */}
      <div className="space-y-4 opacity-50 pointer-events-none grayscale">
        <p className="text-xs text-center">
          Detalle de comidas próximamente...
        </p>
        <MealSection title="Desayuno" calories={0} />
        <MealSection title="Almuerzo" calories={0} />
        <MealSection title="Cena" calories={0} />
      </div>

      {/* FAB with Drawer */}
      <AddFoodDrawer />
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
}: any) {
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

function MealSection({ title, calories }: { title: string; calories: number }) {
  return (
    <Card className="p-4 border-border bg-card hover:bg-muted/30 transition-colors shadow-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center border border-border/50 text-foreground">
            <Leaf className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h3 className="font-bold text-base text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground font-medium">
              0 Alimentos
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-sm font-bold block text-foreground">
            {calories}
          </span>
          <span className="text-[10px] text-muted-foreground uppercase font-bold">
            Kcal
          </span>
        </div>
      </div>
      {/* Empty State / Add Button could go here */}
    </Card>
  );
}
