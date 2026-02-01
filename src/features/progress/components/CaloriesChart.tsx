import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ReferenceLine,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CaloriesChart({ data }: { data: any[] }) {
  return (
    <Card className="border-border bg-card shadow-sm h-[300px]">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold text-foreground">
          Consumo Semanal
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-[220px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 0, right: 10, left: 10, bottom: 0 }}
          >
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#64748b" }}
              dy={10}
            />
            <Tooltip
              cursor={{ fill: "transparent" }}
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            />
            <ReferenceLine y={2000} stroke="#7c3aed" strokeDasharray="3 3" />
            <Bar dataKey="calories" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => {
                // Logic: Red if > 10% over target, Yellow if close, Green if good
                const ratio = entry.calories / entry.target;
                let color = "#059669"; // Green default
                if (ratio > 1.1)
                  color = "#ef4444"; // Red (Over)
                else if (ratio < 0.85) color = "#f59e0b"; // Amber (Too low)

                return <Cell key={`cell-${index}`} fill={color} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
