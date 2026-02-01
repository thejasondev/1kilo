import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WeightChart } from "./components/WeightChart";
import { CaloriesChart } from "./components/CaloriesChart";
import { InsightsCard } from "./components/InsightsCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLiveQuery } from "dexie-react-hooks";
import {
  db,
  type UserProfile,
  type WeightLog,
  type DailyLog,
} from "@/lib/storage/db";
import { useAuth } from "@/features/auth/AuthContext";
import { DexieAdapter } from "@/lib/storage/dexieAdapter";
import { useEffect, useState } from "react";

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

  const nutritionData =
    dailyLogs
      ?.map((log) => {
        // Use logged target if available (future proofing), or current profile target
        const target = 2000; // Fallback
        return {
          day: new Date(log.date).toLocaleDateString("es-ES", {
            weekday: "short",
          }),
          calories: log.calories,
          target: profile?.tdee ? Math.round(profile.tdee) : target,
        };
      })
      .slice(-7) || []; // Last 7 entries

  // Calculate Real Insights
  const generateInsights = () => {
    if (!weightLogs || weightLogs.length < 2)
      return {
        weightTrend: 0,
        weeksToGoal: 0,
        consistencyScore: 100,
        nextMilestone: profile?.targetWeight || 0,
      };

    const first = weightLogs[0];
    const last = weightLogs[weightLogs.length - 1];
    // Simple linear trend (Total Change / Weeks)
    const weeks = Math.max(
      1,
      (new Date(last.date).getTime() - new Date(first.date).getTime()) /
        (1000 * 60 * 60 * 24 * 7),
    );
    const trend = (last.weight - first.weight) / weeks;

    const remaining = last.weight - (profile?.targetWeight || last.weight);
    const weeksToGoal =
      Math.abs(trend) > 0.1 ? Math.abs(remaining / trend) : 99;

    return {
      weightTrend: Number(trend.toFixed(1)),
      weeksToGoal: Math.round(weeksToGoal),
      consistencyScore: 85, // Placeholder logic for consistency
      nextMilestone: profile?.targetWeight || 0,
    };
  };

  const insights = generateInsights();

  return (
    <div className="h-full flex flex-col space-y-4 pb-24">
      <div className="space-y-1">
        <h1 className="text-3xl font-black tracking-tight text-foreground">
          Tu Progreso
        </h1>
        <p className="text-sm font-medium text-muted-foreground">
          Analítica en Tiempo Real
        </p>
      </div>

      <ScrollArea className="flex-1 -mx-4 px-4">
        <div className="space-y-6 pb-6">
          {/* Insights Section */}
          <section>
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">
              Resumen Inteligente
            </h2>
            <InsightsCard insights={insights} />
          </section>

          {/* Tabs Section */}
          <Tabs defaultValue="weight" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 bg-muted/60 p-1">
              <TabsTrigger
                value="weight"
                className="data-[state=active]:bg-card data-[state=active]:shadow-sm font-bold"
              >
                Peso Corporal
              </TabsTrigger>
              <TabsTrigger
                value="nutrition"
                className="data-[state=active]:bg-card data-[state=active]:shadow-sm font-bold"
              >
                Nutrición
              </TabsTrigger>
            </TabsList>

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
                <div className="h-[300px] flex items-center justify-center bg-card border border-dashed border-border rounded-xl">
                  <p className="text-muted-foreground">
                    Aún no hay registros de peso
                  </p>
                </div>
              )}
              <p className="text-xs text-center text-muted-foreground mt-3 bg-muted/30 p-2 rounded-lg">
                {insights.weeksToGoal < 99
                  ? `A este ritmo llegarás a tu meta en ${insights.weeksToGoal} semanas.`
                  : "Registra más pesos para calcular tu proyección."}
              </p>
            </TabsContent>

            <TabsContent
              value="nutrition"
              className="mt-0 animate-in fade-in-0 zoom-in-95 duration-200"
            >
              {nutritionData.length > 0 ? (
                <CaloriesChart data={nutritionData} />
              ) : (
                <div className="h-[300px] flex items-center justify-center bg-card border border-dashed border-border rounded-xl">
                  <p className="text-muted-foreground">
                    Registra tu comida en el Diario
                  </p>
                </div>
              )}
              <p className="text-xs text-center text-muted-foreground mt-3 bg-muted/30 p-2 rounded-lg">
                Tu consistencia nutricional es clave para el éxito.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}
