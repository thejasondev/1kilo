import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Utensils, Zap, Droplet } from "lucide-react";
import { cn } from "@/lib/utils";

interface MacroData {
  day: string;
  protein: number;
  carbs: number;
  fats: number;
}

interface MacrosChartProps {
  data: MacroData[];
  targets: {
    protein: number;
    carbs: number;
    fats: number;
  };
}

export function MacrosChart({ data, targets }: MacrosChartProps) {
  // Calculate averages for the period
  const avgProtein =
    data.reduce((sum, d) => sum + d.protein, 0) / (data.length || 1);
  const avgCarbs =
    data.reduce((sum, d) => sum + d.carbs, 0) / (data.length || 1);
  const avgFats = data.reduce((sum, d) => sum + d.fats, 0) / (data.length || 1);

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold text-foreground">
          Macros de la Semana
        </CardTitle>
      </CardHeader>

      {/* Summary Stats */}
      <CardContent className="pb-4">
        <div className="grid grid-cols-3 gap-3 mb-4">
          <MacroAvgCard
            label="Proteína"
            icon={Utensils}
            avg={avgProtein}
            target={targets.protein}
            color="emerald"
          />
          <MacroAvgCard
            label="Carbos"
            icon={Zap}
            avg={avgCarbs}
            target={targets.carbs}
            color="amber"
          />
          <MacroAvgCard
            label="Grasas"
            icon={Droplet}
            avg={avgFats}
            target={targets.fats}
            color="violet"
          />
        </div>

        {/* Stacked Bar Chart */}
        <div className="h-[180px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
            >
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#64748b" }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  fontSize: "12px",
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: "10px", paddingTop: "8px" }}
                iconType="circle"
                iconSize={8}
              />
              <Bar
                dataKey="protein"
                name="Proteína"
                stackId="a"
                fill="#10b981"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="carbs"
                name="Carbos"
                stackId="a"
                fill="#f59e0b"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="fats"
                name="Grasas"
                stackId="a"
                fill="#8b5cf6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function MacroAvgCard({
  label,
  icon: Icon,
  avg,
  target,
  color,
}: {
  label: string;
  icon: typeof Utensils;
  avg: number;
  target: number;
  color: "emerald" | "amber" | "violet";
}) {
  const ratio = avg / target;
  const status =
    ratio >= 0.9 && ratio <= 1.1 ? "on-target" : ratio < 0.9 ? "under" : "over";

  const colorClasses = {
    emerald: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-600 dark:text-emerald-400",
      icon: "text-emerald-500",
    },
    amber: {
      bg: "bg-amber-500/10",
      text: "text-amber-600 dark:text-amber-400",
      icon: "text-amber-500",
    },
    violet: {
      bg: "bg-violet-500/10",
      text: "text-violet-600 dark:text-violet-400",
      icon: "text-violet-500",
    },
  };

  const statusColors = {
    "on-target": "text-emerald-500",
    under: "text-amber-500",
    over: "text-red-500",
  };

  return (
    <div className={cn("rounded-lg p-2.5 text-center", colorClasses[color].bg)}>
      <div className="flex items-center justify-center gap-1 mb-1">
        <Icon className={cn("h-3 w-3", colorClasses[color].icon)} />
        <span className="text-[10px] uppercase font-bold text-muted-foreground">
          {label}
        </span>
      </div>
      <p className={cn("text-lg font-black", colorClasses[color].text)}>
        {Math.round(avg)}g
      </p>
      <p className={cn("text-[10px] font-medium", statusColors[status])}>
        {status === "on-target"
          ? "✓ En meta"
          : status === "under"
            ? `↓ ${Math.round(target - avg)}g`
            : `↑ ${Math.round(avg - target)}g`}
      </p>
    </div>
  );
}
