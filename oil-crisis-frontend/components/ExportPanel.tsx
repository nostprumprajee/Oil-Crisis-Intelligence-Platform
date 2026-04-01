"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { exportHistoricalData, exportLatestPrices } from "@/utils/export";

interface ExportPanelProps {
  data: any[];
  latest: any[];
}

export default function ExportPanel({ data, latest }: ExportPanelProps) {
  const { colors } = useTheme();
  const { t } = useLanguage();

  return (
    <div>
      <h3 style={{ color: colors.accent, marginBottom: 12 }}>{t.panels.dataExport}</h3>

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
            {t.export.historical}
          </div>
          <div style={{ fontSize: 11, color: colors.textSecondary }}>
            {t.export.historicalDesc.replace("{count}", data.length.toString())}
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
            {t.export.latestPrices}
          </div>
          <div style={{ fontSize: 11, color: colors.textSecondary }}>
            {t.export.latestDesc.replace("{count}", latest.length.toString())}
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
        {t.export.tip}
      </div>
    </div>
  );
}
