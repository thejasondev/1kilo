import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WeightChart } from "./components/WeightChart";
import { CaloriesChart } from "./components/CaloriesChart";
import { MacrosChart } from "./components/MacrosChart";
import { InsightsCard, type InsightsData } from "./components/InsightsCard";
import { useLiveQuery } from "dexie-react-hooks";
import {
  db,
  type UserProfile,
  type WeightLog,
  type DailyLog,
} from "@/lib/storage/db";
import { useAuth } from "@/features/auth/AuthContext";
import { DexieAdapter } from "@/lib/storage/dexieAdapter";
import { useEffect, useState, useMemo } from "react";
import { Scale, Utensils, PieChart } from "lucide-react";

export function ProgressPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Fetch Profile for Targets
  useEffect(() => {
    if (user) {
      const adapter = new DexieAdapter<UserProfile>("profile");
      adapter.getById(user.id).then(setProfile);
    }
  }, [user]);

  // Fetch Real Data using Live Query
  const weightLogs = useLiveQuery<WeightLog[]>(async () => {
    if (!user) return [];
    return await db.weight_logs.where("userId").equals(user.id).sortBy("date");
  }, [user]);

  const dailyLogs = useLiveQuery<DailyLog[]>(async () => {
    if (!user) return [];
    return await db.daily_logs.where("userId").equals(user.id).sortBy("date");
  }, [user]);

  // Process Data for Charts
  const weightData =
    weightLogs?.map((log) => ({
      date: log.date.slice(5).replace("-", "/"), // MM/DD
      weight: log.weight,
    })) || [];

  const targetCalories = profile?.tdee ? Math.round(profile.tdee) : 2000;

  const nutritionData = useMemo(() => {
    return (
      dailyLogs
        ?.map((log) => ({
          day: new Date(log.date).toLocaleDateString("es-ES", {
            weekday: "short",
          }),
          calories: log.calories,
          target: targetCalories,
        }))
        .slice(-7) || []
    );
  }, [dailyLogs, targetCalories]);

  // Macros data for last 7 days
  const macrosData = useMemo(() => {
    return (
      dailyLogs
        ?.map((log) => ({
          day: new Date(log.date).toLocaleDateString("es-ES", {
            weekday: "short",
          }),
          protein: log.macros.protein,
          carbs: log.macros.carbs,
          fats: log.macros.fats,
        }))
        .slice(-7) || []
    );
  }, [dailyLogs]);

  // Calculate Real Insights
  const insights: InsightsData = useMemo(() => {
    // Defaults
    const defaults: InsightsData = {
      weightTrend: 0,
      weeksToGoal: 99,
      consistencyScore: 0,
      currentStreak: 0,
      calorieAdherence: 0,
      goalProgress: 0,
      currentWeight: profile?.weight,
      targetWeight: profile?.targetWeight,
      goal: profile?.goal,
    };

    if (!dailyLogs || dailyLogs.length === 0) return defaults;

    // --- Weight Trend ---
    let weightTrend = 0;
    let weeksToGoal = 99;

    if (weightLogs && weightLogs.length >= 2) {
      const first = weightLogs[0];
      const last = weightLogs[weightLogs.length - 1];
      const weeks = Math.max(
        1,
        (new Date(last.date).getTime() - new Date(first.date).getTime()) /
          (1000 * 60 * 60 * 24 * 7),
      );
      weightTrend = (last.weight - first.weight) / weeks;

      if (profile?.targetWeight) {
        const remaining = last.weight - profile.targetWeight;
        weeksToGoal =
          Math.abs(weightTrend) > 0.1 ? Math.abs(remaining / weightTrend) : 99;
      }
    }

    // --- Consistency Score (days with logging / total days since first log) ---
    const firstLogDate = new Date(dailyLogs[0].date);
    const today = new Date();
    const totalDays = Math.max(
      1,
      Math.ceil(
        (today.getTime() - firstLogDate.getTime()) / (1000 * 60 * 60 * 24),
      ),
    );
    const daysWithLogging = dailyLogs.length;
    const consistencyScore = Math.min(100, (daysWithLogging / totalDays) * 100);

    // --- Current Streak (consecutive days logging, counting backwards from today) ---
    let currentStreak = 0;
    const logDates = new Set(dailyLogs.map((l) => l.date));

    for (let i = 0; i <= totalDays; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const checkStr = checkDate.toISOString().split("T")[0];

      if (logDates.has(checkStr)) {
        currentStreak++;
      } else if (i > 0) {
        // If not today and no log, break streak
        break;
      }
    }

    // --- Calorie Adherence (days within ±10% of target) ---
    const daysWithinTarget = dailyLogs.filter((log) => {
      const ratio = log.calories / targetCalories;
      return ratio >= 0.9 && ratio <= 1.1;
    }).length;
    const calorieAdherence = (daysWithinTarget / daysWithLogging) * 100;

    // --- Goal Progress ---
    let goalProgress = 0;
    if (
      profile?.startWeight &&
      profile?.targetWeight &&
      weightLogs &&
      weightLogs.length > 0
    ) {
      const currentWeight = weightLogs[weightLogs.length - 1].weight;
      const totalChange = Math.abs(profile.startWeight - profile.targetWeight);
      const progressMade = Math.abs(profile.startWeight - currentWeight);
      goalProgress = Math.min(100, (progressMade / totalChange) * 100);
    }

    return {
      weightTrend: Number(weightTrend.toFixed(2)),
      weeksToGoal: Math.round(weeksToGoal),
      consistencyScore,
      currentStreak,
      calorieAdherence,
      goalProgress,
      currentWeight: weightLogs?.[weightLogs.length - 1]?.weight,
      targetWeight: profile?.targetWeight,
      goal: profile?.goal,
    };
  }, [weightLogs, dailyLogs, profile, targetCalories]);

  const targetMacros = profile?.macros || {
    protein: 150,
    carbs: 200,
    fats: 60,
  };

  return (
    <div className="h-full flex flex-col space-y-6 pb-32">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-black tracking-tight text-foreground">
          Tu Progreso
        </h1>
        <p className="text-sm font-medium text-muted-foreground">
          Analítica en tiempo real
        </p>
      </div>

      {/* Insights Section */}
      <InsightsCard insights={insights} />

      {/* Charts Tabs */}
      <Tabs defaultValue="nutrition" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4 bg-muted/60 p-1">
          <TabsTrigger
            value="nutrition"
            className="data-[state=active]:bg-card data-[state=active]:shadow-sm font-bold gap-1.5"
          >
            <Utensils className="h-4 w-4" />
            Calorías
          </TabsTrigger>
          <TabsTrigger
            value="macros"
            className="data-[state=active]:bg-card data-[state=active]:shadow-sm font-bold gap-1.5"
          >
            <PieChart className="h-4 w-4" />
            Macros
          </TabsTrigger>
          <TabsTrigger
            value="weight"
            className="data-[state=active]:bg-card data-[state=active]:shadow-sm font-bold gap-1.5"
          >
            <Scale className="h-4 w-4" />
            Peso
          </TabsTrigger>
        </TabsList>

        {/* Calories Tab */}
        <TabsContent
          value="nutrition"
          className="mt-0 animate-in fade-in-0 zoom-in-95 duration-200"
        >
          {nutritionData.length > 0 ? (
            <CaloriesChart data={nutritionData} />
          ) : (
            <EmptyState message="Registra tu comida en el Diario" />
          )}
          <p className="text-xs text-center text-muted-foreground mt-3 bg-muted/30 p-2 rounded-lg">
            {insights.calorieAdherence >= 80
              ? "¡Excelente adherencia! Sigue así."
              : "Tu consistencia nutricional es clave para el éxito."}
          </p>
        </TabsContent>

        {/* Macros Tab */}
        <TabsContent
          value="macros"
          className="mt-0 animate-in fade-in-0 zoom-in-95 duration-200"
        >
          {macrosData.length > 0 ? (
            <MacrosChart data={macrosData} targets={targetMacros} />
          ) : (
            <EmptyState message="Registra comidas para ver tus macros" />
          )}
          <p className="text-xs text-center text-muted-foreground mt-3 bg-muted/30 p-2 rounded-lg">
            Proteína: {targetMacros.protein}g • Carbos: {targetMacros.carbs}g •
            Grasas: {targetMacros.fats}g
          </p>
        </TabsContent>

        {/* Weight Tab */}
        <TabsContent
          value="weight"
          className="mt-0 animate-in fade-in-0 zoom-in-95 duration-200"
        >
          {weightData.length > 0 ? (
            <WeightChart
              data={weightData}
              targetWeight={profile?.targetWeight}
            />
          ) : (
            <EmptyState message="Aún no hay registros de peso" />
          )}
          <p className="text-xs text-center text-muted-foreground mt-3 bg-muted/30 p-2 rounded-lg">
            {insights.weeksToGoal < 99
              ? `A este ritmo llegarás a tu meta en ~${insights.weeksToGoal} semanas.`
              : "Registra más pesos para calcular tu proyección."}
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="h-[300px] flex items-center justify-center bg-card border border-dashed border-border rounded-xl">
      <p className="text-muted-foreground text-center px-4">{message}</p>
    </div>
  );
}
