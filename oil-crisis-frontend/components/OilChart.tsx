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
import { useLanguage } from "@/contexts/LanguageContext";

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

export default function OilChart({ data, selectedFuels }: { data: any[]; selectedFuels: string[] }) {
  const { colors } = useTheme();
  const { t } = useLanguage();

  // Check which fuels are selected
  const showDiesel = selectedFuels.some(f => f.includes("Diesel") || f.includes("ดีเซล"));
  const showGasohol95 = selectedFuels.some(f => f.includes("Gasohol95") || f.includes("แก๊สโซฮอล์ 95"));

  return (
    <div
      style={{
        background: colors.chartBg,
        padding: 16,
        borderRadius: 10,
        border: `1px solid ${colors.border}`
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <h3 style={{ color: colors.accent, margin: 0 }}>
          {t.chart.title}
        </h3>
        <div style={{ fontSize: 12, color: colors.textSecondary }}>
          {data.length} {t.chart.dataPoints} • {selectedFuels.length} {t.chart.fuels}{selectedFuels.length > 1 ? 's' : ''}
        </div>
      </div>

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

          {/* Diesel Lines - only show if selected */}
          {showDiesel && (
            <>
              <Area
                type="monotone"
                dataKey="Diesel_low"
                stackId="diesel"
                stroke="none"
                fill="transparent"
              />

              <Line
                type="monotone"
                dataKey="Diesel"
                stroke={colors.up}
                strokeWidth={3}
                dot={false}
                name={`${t.chart.diesel} (${t.chart.actual})`}
              />

              <Line
                type="monotone"
                dataKey="Diesel_pred"
                stroke={colors.up}
                strokeDasharray="5 5"
                dot={false}
                name={`${t.chart.diesel} (${t.chart.forecast})`}
                connectNulls
              />
            </>
          )}

          {/* Gasohol95 Lines - only show if selected */}
          {showGasohol95 && (
            <>
              <Area
                type="monotone"
                dataKey="Gasohol95_low"
                stackId="gas"
                stroke="none"
                fill="transparent"
              />

              <Line
                type="monotone"
                dataKey="Gasohol95"
                stroke={colors.accent}
                strokeWidth={3}
                dot={false}
                name={`${t.chart.gasohol95} (${t.chart.actual})`}
              />

              <Line
                type="monotone"
                dataKey="Gasohol95_pred"
                stroke={colors.accent}
                strokeDasharray="5 5"
                dot={false}
                name={`${t.chart.gasohol95} (${t.chart.forecast})`}
                connectNulls
              />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}