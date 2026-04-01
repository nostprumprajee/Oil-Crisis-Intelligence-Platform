"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface DateRangeSelectorProps {
  selectedDays: number;
  onDaysChange: (days: number) => void;
}

export default function DateRangeSelector({ selectedDays, onDaysChange }: DateRangeSelectorProps) {
  const { colors } = useTheme();
  const { language } = useLanguage();

  const presets = [
    { days: 7, label: language === "en" ? "7 Days" : "7 วัน" },
    { days: 14, label: language === "en" ? "14 Days" : "14 วัน" },
    { days: 30, label: language === "en" ? "30 Days" : "30 วัน" },
    { days: 60, label: language === "en" ? "60 Days" : "60 วัน" },
    { days: 90, label: language === "en" ? "90 Days" : "90 วัน" }
  ];

  return (
    <div style={{ 
      display: "flex", 
      alignItems: "center", 
      gap: 8,
      flexWrap: "wrap"
    }}>
      <span style={{ 
        fontSize: 13, 
        color: colors.textSecondary,
        fontWeight: 500
      }}>
        {language === "en" ? "📅 Date Range:" : "📅 ช่วงเวลา:"}
      </span>

      {presets.map((preset) => {
        const isSelected = selectedDays === preset.days;
        
        return (
          <button
            key={preset.days}
            onClick={() => onDaysChange(preset.days)}
            style={{
              background: isSelected 
                ? colors.accent
                : colors.chartBg,
              border: `1px solid ${isSelected ? colors.accent : colors.border}`,
              borderRadius: 6,
              padding: "6px 12px",
              color: isSelected ? "#000" : colors.text,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: isSelected ? 600 : 400,
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                e.currentTarget.style.borderColor = colors.accent;
                e.currentTarget.style.background = `${colors.accent}22`;
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.style.borderColor = colors.border;
                e.currentTarget.style.background = colors.chartBg;
              }
            }}
          >
            {preset.label}
          </button>
        );
      })}

      {/* Custom input */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <input
          type="number"
          min="1"
          max="90"
          value={selectedDays}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            if (!isNaN(val) && val >= 1 && val <= 90) {
              onDaysChange(val);
            }
          }}
          style={{
            width: 60,
            padding: "6px 8px",
            background: colors.chartBg,
            border: `1px solid ${colors.border}`,
            borderRadius: 6,
            color: colors.text,
            fontSize: 12,
            textAlign: "center"
          }}
        />
        <span style={{ fontSize: 11, color: colors.textSecondary }}>
          {language === "en" ? "days" : "วัน"}
        </span>
      </div>
    </div>
  );
}
