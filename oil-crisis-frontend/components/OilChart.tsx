"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  Legend
} from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div
      style={{
        background: "#111",
        border: "1px solid #333",
        padding: 10,
        borderRadius: 6
      }}
    >
      <div style={{ color: "#888", marginBottom: 6 }}>{label}</div>

      {payload.map((p: any, i: number) => (
        <div key={i} style={{ color: p.color, fontSize: 13 }}>
          {p.name}: <b>{p.value}</b>
        </div>
      ))}
    </div>
  );
};

export default function OilChart({ data }: { data: any[] }) {
  return (
    <div
      style={{
        background: "#0a0a0a",
        padding: 16,
        borderRadius: 10,
        border: "1px solid #222"
      }}
    >
      <h3 style={{ color: "#facc15", marginBottom: 10 }}>
        Oil Price Trend + Forecast
      </h3>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid stroke="#222" />

          <XAxis dataKey="date" stroke="#888" />
          <YAxis stroke="#888" />

          <Tooltip content={<CustomTooltip />} />
          <Legend />

          {/* 🌈 Diesel Confidence Band */}
          <Area
            type="monotone"
            dataKey="Diesel_high"
            stroke="none"
            fill="#22c55e22"
          />
          <Area
            type="monotone"
            dataKey="Diesel_low"
            stroke="none"
            fill="#000"
          />

          {/* 🌈 Gasohol95 Confidence Band */}
          <Area
            type="monotone"
            dataKey="Gasohol95_high"
            stroke="none"
            fill="#facc1522"
          />
          <Area
            type="monotone"
            dataKey="Gasohol95_low"
            stroke="none"
            fill="#000"
          />

          {/* 📈 Actual Lines */}
          <Line
            type="monotone"
            dataKey="Diesel"
            stroke="#22c55e"
            strokeWidth={3}
            dot={false}
            name="Diesel (Actual)"
          />

          <Line
            type="monotone"
            dataKey="Gasohol95"
            stroke="#facc15"
            strokeWidth={3}
            dot={false}
            name="Gasohol 95 (Actual)"
          />

          {/* 🔮 Prediction Lines */}
          <Line
            type="monotone"
            dataKey="Diesel_pred"
            stroke="#22c55e"
            strokeDasharray="5 5"
            dot={false}
            name="Diesel (Forecast)"
            connectNulls
          />

          <Line
            type="monotone"
            dataKey="Gasohol95_pred"
            stroke="#facc15"
            strokeDasharray="5 5"
            dot={false}
            name="Gasohol 95 (Forecast)"
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}