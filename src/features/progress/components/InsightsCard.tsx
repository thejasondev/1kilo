import { Card, CardContent } from "@/components/ui/card";
import { TrendingDown, Calendar, Award } from "lucide-react";

export function InsightsCard({ insights }: { insights: any }) {
  return (
    <div className="grid gap-3">
      <Card className="bg-gradient-to-br from-indigo-500 to-violet-600 border-none text-white shadow-lg">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <TrendingDown className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-white/80 text-xs uppercase font-bold">
              Ritmo Actual
            </p>
            <p className="text-2xl font-black">
              {Math.abs(insights.weightTrend)} kg{" "}
              <span className="text-sm font-medium opacity-80">/ semana</span>
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="text-xs font-bold uppercase">Meta en</span>
            </div>
            <p className="text-xl font-black text-foreground">
              {insights.weeksToGoal} Semanas
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2 text-muted-foreground">
              <Award className="h-4 w-4" />
              <span className="text-xs font-bold uppercase">Constancia</span>
            </div>
            <p className="text-xl font-black text-emerald-600">
              {insights.consistencyScore}%
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
