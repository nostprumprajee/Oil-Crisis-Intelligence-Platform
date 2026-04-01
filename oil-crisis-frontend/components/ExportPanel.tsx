"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { exportHistoricalData, exportLatestPrices } from "@/utils/export";

interface ExportPanelProps {
  data: any[];
  latest: any[];
}

export default function ExportPanel({ data, latest }: ExportPanelProps) {
  const { colors } = useTheme();

  return (
    <div>
      <h3 style={{ color: colors.accent, marginBottom: 12 }}>📥 Data Export</h3>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <button
          onClick={() => exportHistoricalData(data)}
          style={{
            background: `linear-gradient(135deg, ${colors.up}22, transparent)`,
            border: `1px solid ${colors.border}`,
            borderRadius: 8,
            padding: "10px 14px",
            color: colors.text,
            cursor: "pointer",
            fontSize: 13,
            textAlign: "left",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = colors.up;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = colors.border;
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 4 }}>
            📊 Historical Data
          </div>
          <div style={{ fontSize: 11, color: colors.textSecondary }}>
            Export all {data.length} records with predictions
          </div>
        </button>

        <button
          onClick={() => exportLatestPrices(latest)}
          style={{
            background: `linear-gradient(135deg, ${colors.accent}22, transparent)`,
            border: `1px solid ${colors.border}`,
            borderRadius: 8,
            padding: "10px 14px",
            color: colors.text,
            cursor: "pointer",
            fontSize: 13,
            textAlign: "left",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = colors.accent;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = colors.border;
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 4 }}>
            💾 Latest Prices
          </div>
          <div style={{ fontSize: 11, color: colors.textSecondary }}>
            Export current {latest.length} fuel prices
          </div>
        </button>
      </div>

      <div style={{ 
        marginTop: 12, 
        padding: 10, 
        background: `${colors.accent}11`,
        borderRadius: 6,
        fontSize: 11,
        color: colors.textSecondary 
      }}>
        💡 CSV files include timestamps and are ready for Excel/Google Sheets
      </div>
    </div>
  );
}
