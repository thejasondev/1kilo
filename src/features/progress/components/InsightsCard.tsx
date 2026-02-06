import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingDown,
  TrendingUp,
  Calendar,
  Award,
  Flame,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProgressRing } from "./ProgressRing";

export interface InsightsData {
  weightTrend: number; // kg per week (+/-)
  weeksToGoal: number;
  consistencyScore: number; // 0-100
  currentStreak: number; // days
  calorieAdherence: number; // % of days within target
  goalProgress: number; // % toward target weight
  currentWeight?: number;
  targetWeight?: number;
  goal?: "cut" | "maintain" | "bulk";
}

export function InsightsCard({ insights }: { insights: InsightsData }) {
  const isLosing = insights.weightTrend < 0;
  const isMaintaining = Math.abs(insights.weightTrend) < 0.1;

  // Determine trend display
  const TrendIcon = isLosing ? TrendingDown : TrendingUp;
  const trendLabel = isLosing
    ? "Perdiendo"
    : isMaintaining
      ? "Manteniendo"
      : "Ganando";
  const trendColor = isMaintaining
    ? "from-blue-500 to-cyan-500"
    : insights.goal === "cut"
      ? isLosing
        ? "from-emerald-500 to-teal-600"
        : "from-red-500 to-orange-500"
      : insights.goal === "bulk"
        ? isLosing
          ? "from-amber-500 to-orange-500"
          : "from-emerald-500 to-teal-600"
        : "from-indigo-500 to-violet-600";

  return (
    <div className="space-y-3">
      {/* Main Progress Card */}
      <Card
        className={cn(
          "bg-gradient-to-br border-none text-white shadow-lg overflow-hidden",
          trendColor,
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            {/* Left: Stats */}
            <div className="space-y-3">
              <div>
                <div className="flex items-center gap-2 text-white/80 mb-1">
                  <TrendIcon className="h-4 w-4" />
                  <span className="text-xs uppercase font-bold tracking-wider">
                    {trendLabel}
                  </span>
                </div>
                <p className="text-3xl font-black">
                  {Math.abs(insights.weightTrend).toFixed(1)} kg
                  <span className="text-sm font-medium opacity-80 ml-1">
                    / semana
                  </span>
                </p>
              </div>

              {/* Streak badge */}
              {insights.currentStreak > 0 && (
                <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5">
                  <Flame className="h-4 w-4 text-orange-300" />
                  <span className="text-sm font-bold">
                    {insights.currentStreak} días seguidos
                  </span>
                </div>
              )}
            </div>

            {/* Right: Progress Ring */}
            <div className="flex flex-col items-center">
              <ProgressRing
                progress={insights.goalProgress}
                size={80}
                strokeWidth={8}
                label={`${Math.round(insights.goalProgress)}%`}
                color="primary"
              />
              <span className="text-[10px] uppercase font-bold text-white/70 mt-1">
                Meta
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2">
        <StatCard
          icon={Calendar}
          label="Llegarás en"
          value={
            insights.weeksToGoal < 99 ? `${insights.weeksToGoal} sem` : "—"
          }
          sublabel={insights.weeksToGoal < 99 ? "aprox." : ""}
        />
        <StatCard
          icon={Award}
          label="Constancia"
          value={`${Math.round(insights.consistencyScore)}%`}
          sublabel="registro"
          valueColor={
            insights.consistencyScore >= 80
              ? "text-emerald-600"
              : insights.consistencyScore >= 60
                ? "text-amber-600"
                : "text-red-600"
          }
        />
        <StatCard
          icon={Target}
          label="Adherencia"
          value={`${Math.round(insights.calorieAdherence)}%`}
          sublabel="kcal"
          valueColor={
            insights.calorieAdherence >= 80
              ? "text-emerald-600"
              : insights.calorieAdherence >= 60
                ? "text-amber-600"
                : "text-red-600"
          }
        />
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sublabel,
  valueColor = "text-foreground",
}: {
  icon: typeof Calendar;
  label: string;
  value: string;
  sublabel?: string;
  valueColor?: string;
}) {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-3">
        <div className="flex items-center gap-1.5 mb-1.5 text-muted-foreground">
          <Icon className="h-3.5 w-3.5" />
          <span className="text-[10px] font-bold uppercase tracking-wide truncate">
            {label}
          </span>
        </div>
        <p className={cn("text-lg font-black", valueColor)}>{value}</p>
        {sublabel && (
          <p className="text-[10px] text-muted-foreground font-medium">
            {sublabel}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
