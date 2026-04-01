"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface AutoRefreshControlProps {
  isEnabled: boolean;
  interval: number;
  countdown: number;
  onToggle: () => void;
  onIntervalChange: (interval: number) => void;
}

export default function AutoRefreshControl({
  isEnabled,
  interval,
  countdown,
  onToggle,
  onIntervalChange
}: AutoRefreshControlProps) {
  const { colors } = useTheme();
  const { language } = useLanguage();

  const intervals = [
    { value: 15, label: "15s" },
    { value: 30, label: "30s" },
    { value: 60, label: "1m" },
    { value: 300, label: "5m" },
    { value: 600, label: "10m" }
  ];

  const formatCountdown = (seconds: number): string => {
    if (seconds >= 60) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    return `${seconds}s`;
  };

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      flexWrap: "wrap",
      minWidth: 300
    }}>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 12px",
          background: isEnabled ? colors.accent : colors.chartBg,
          border: `1px solid ${isEnabled ? colors.accent : colors.border}`,
          borderRadius: 6,
          color: isEnabled ? "#000" : colors.text,
          cursor: "pointer",
          fontSize: 12,
          fontWeight: isEnabled ? 600 : 400,
          transition: "all 0.2s",
          whiteSpace: "nowrap"
        }}
        title={language === "en" ? "Toggle auto-refresh" : "เปิด/ปิดการรีเฟรชอัตโนมัติ"}
      >
        <span style={{ fontSize: 14 }}>
          {isEnabled ? "🔄" : "⏸️"}
        </span>
        <span>
          {language === "en" ? "Auto-refresh" : "รีเฟรชอัตโนมัติ"}
        </span>
      </button>

      {/* Interval Selector */}
      {isEnabled && (
        <>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 6
          }}>
            <span style={{ fontSize: 11, color: colors.textSecondary }}>
              {language === "en" ? "Every:" : "ทุก:"}
            </span>
            {intervals.map((int) => (
              <button
                key={int.value}
                onClick={() => onIntervalChange(int.value)}
                style={{
                  padding: "4px 8px",
                  background: interval === int.value ? `${colors.accent}33` : colors.chartBg,
                  border: `1px solid ${interval === int.value ? colors.accent : colors.border}`,
                  borderRadius: 4,
                  color: interval === int.value ? colors.accent : colors.text,
                  cursor: "pointer",
                  fontSize: 11,
                  fontWeight: interval === int.value ? 600 : 400,
                  transition: "all 0.2s"
                }}
              >
                {int.label}
              </button>
            ))}
          </div>

          {/* Countdown */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 10px",
            background: `${colors.accent}11`,
            border: `1px solid ${colors.accent}33`,
            borderRadius: 6
          }}>
            <span style={{ fontSize: 11, color: colors.textSecondary }}>
              {language === "en" ? "Next:" : "ถัดไป:"}
            </span>
            <span style={{
              fontSize: 12,
              fontWeight: 600,
              color: colors.accent,
              fontFamily: "monospace",
              minWidth: 35,
              textAlign: "right"
            }}>
              {formatCountdown(countdown)}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
