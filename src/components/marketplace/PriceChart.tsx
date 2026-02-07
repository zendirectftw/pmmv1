"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PriceChartProps {
  data: {
    time: string;
    price: number;
  }[];
}

export default function PriceChart({ data }: PriceChartProps) {
  return (
    <div className="h-[300px] w-full bg-[var(--card)] rounded-xl border border-[var(--border)] p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke="var(--border)" 
          />
          <XAxis
            dataKey="time"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--muted)", fontSize: 12 }}
            dy={10}
          />
          <YAxis
            hide
            domain={["auto", "auto"]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            itemStyle={{ color: "var(--foreground)" }}
            labelStyle={{ color: "var(--muted)", marginBottom: "4px" }}
            // FIXED: Handling number | undefined to satisfy TypeScript
            formatter={(value: number | undefined) => [
              value !== undefined ? `$${value.toLocaleString()}` : "$0.00",
              "Spot USD"
            ]}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="var(--primary)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}