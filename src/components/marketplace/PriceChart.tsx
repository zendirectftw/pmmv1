"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface PriceChartProps {
  metal: string;
}

// TODO: Replace with real historical API (e.g. metals.live history). For now we show placeholder or last 7 days from DB.
export function PriceChart({ metal }: PriceChartProps) {
  const [data, setData] = useState<{ date: string; price: number }[]>([]);

  useEffect(() => {
    fetch(`/api/spot-prices/history?metal=${metal}`)
      .then((r) => r.json())
      .then((d) => setData(Array.isArray(d) ? d : []))
      .catch(() => setData([]));
  }, [metal]);

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-[var(--border)] h-64 flex items-center justify-center text-[var(--muted)] bg-[var(--card)]">
        Historical spot data will appear here when available. Connect a metals API for live history.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--border)] p-4 h-64 bg-[var(--card)]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="date" stroke="var(--muted)" fontSize={12} />
          <YAxis stroke="var(--muted)" fontSize={12} tickFormatter={(v) => `$${v}`} />
          <Tooltip
            contentStyle={{ background: "var(--card)", border: "1px solid var(--border)" }}
            formatter={(value: number) => [`$${value.toFixed(2)}`, "Spot USD"]}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="var(--gold)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
