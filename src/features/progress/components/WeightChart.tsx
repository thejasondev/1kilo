import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function WeightChart({
  data,
  targetWeight,
}: {
  data: any[];
  targetWeight?: number;
}) {
  // Calculate domain to make the chart look dynamic (zoom in on the relevant range)
  const minWeight = Math.min(...data.map((d) => d.weight)) - 1;
  const maxWeight = Math.max(...data.map((d) => d.weight)) + 1;

  return (
    <Card className="border-border bg-card shadow-sm h-[350px]">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold text-foreground flex justify-between items-center">
          Tendencia de Peso
          {data.length > 2 && (
            <span className="text-xs font-normal text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
              {(data[data.length - 1].weight - data[0].weight).toFixed(1)} kg
              totales
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-[280px] w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#059669" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#059669" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e5e7eb"
              opacity={0.5}
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#64748b" }}
              dy={10}
            />
            <YAxis
              domain={[minWeight, maxWeight]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#64748b" }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              itemStyle={{ color: "#059669", fontWeight: "bold" }}
            />
            <Area
              type="monotone"
              dataKey="weight"
              stroke="#059669"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorWeight)"
            />
            {targetWeight && (
              <ReferenceLine
                y={targetWeight}
                stroke="#7c3aed"
                strokeDasharray="3 3"
                strokeWidth={2}
              >
                {/* Label logic can be tricky in Recharts, best to use Legend or custom subtitle */}
              </ReferenceLine>
            )}
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
