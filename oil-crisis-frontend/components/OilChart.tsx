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
import { useTheme } from "@/contexts/ThemeContext";

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
  const { colors } = useTheme();

  return (
    <div
      style={{
        background: colors.chartBg,
        padding: 16,
        borderRadius: 10,
        border: `1px solid ${colors.border}`
      }}
    >
      <h3 style={{ color: colors.accent, marginBottom: 10 }}>
        Oil Price Trend + Forecast
      </h3>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <defs>
            <linearGradient id="dieselBand" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity={0.25}/>
              <stop offset="100%" stopColor="#22c55e" stopOpacity={0}/>
            </linearGradient>

            <linearGradient id="gasBand" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#facc15" stopOpacity={0.25}/>
              <stop offset="100%" stopColor="#facc15" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid stroke={colors.border} />

          <XAxis dataKey="date" stroke={colors.textSecondary} />
          <YAxis stroke={colors.textSecondary} />

          <Tooltip content={<CustomTooltip />} />
          <Legend />

          {/* 🌈 Diesel Confidence Band */}
          {/* <Area
            type="monotone"
            dataKey="Diesel_high"
            stroke="none"
            fill="#22c55e22"
          /> */}
          <Area
            type="monotone"
            dataKey="Diesel_low"
            stackId="diesel"
            stroke="none"
            fill="transparent"
          />

          {/* <Area
            type="monotone"
            dataKey="Diesel_range"
            stackId="diesel"
            stroke="none"
            fill="#url(#dieselBand)"
          /> */}

          {/* 🌈 Gasohol95 Confidence Band */}
          {/* <Area
            type="monotone"
            dataKey="Gasohol95_high"
            stroke="none"
            fill="#facc1522"
          /> */}
          <Area
            type="monotone"
            dataKey="Gasohol95_low"
            stackId="gas"
            stroke="none"
            fill="transparent"
          />

          {/* <Area
            type="monotone"
            dataKey="Gasohol95_range"
            stackId="gas"
            stroke="none"
            fill="#url(#gasBand)"
          /> */}

          {/* 📈 Actual Lines */}
          <Line
            type="monotone"
            dataKey="Diesel"
            stroke={colors.up}
            strokeWidth={3}
            dot={false}
            name="Diesel (Actual)"
          />

          <Line
            type="monotone"
            dataKey="Gasohol95"
            stroke={colors.accent}
            strokeWidth={3}
            dot={false}
            name="Gasohol 95 (Actual)"
          />

          {/* 🔮 Prediction Lines */}
          <Line
            type="monotone"
            dataKey="Diesel_pred"
            stroke={colors.up}
            strokeDasharray="5 5"
            dot={false}
            name="Diesel (Forecast)"
            connectNulls
          />

          <Line
            type="monotone"
            dataKey="Gasohol95_pred"
            stroke={colors.accent}
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