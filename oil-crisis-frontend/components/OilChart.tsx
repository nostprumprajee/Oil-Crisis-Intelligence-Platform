"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function OilChart({ data }: { data: any[] }) {
  return (
    <div style={{
      background: "#0a0a0a",
      padding: 20,
      borderRadius: 12,
      border: "1px solid #222"
    }}>
      <h3 style={{ color: "#facc15" }}>
        Oil Price Trend (TH)
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="date" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#111",
              border: "1px solid #333"
            }}
          />

          {/* Diesel */}
          <Line
            type="monotone"
            dataKey="Diesel"
            stroke="#22c55e"
            strokeWidth={3}
            dot={false}
            isAnimationActive={true}
          />

          {/* Gasohol 95 */}
          <Line
            type="monotone"
            dataKey="Gasohol95"
            stroke="#facc15"
            strokeWidth={3}
            dot={false}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}