"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface FuelFilterProps {
  selectedFuels: string[];
  onToggleFuel: (fuel: string) => void;
  availableFuels: string[];
}

export default function FuelFilter({ selectedFuels, onToggleFuel, availableFuels }: FuelFilterProps) {
  const { colors } = useTheme();
  const { t } = useLanguage();

  const fuelIcons: Record<string, string> = {
    "Diesel": "🚛",
    "Gasohol95": "🚗",
    "Gasohol91": "🏍️",
    "E20": "🌱",
    "E85": "🌿",
    "Premium": "⭐"
  };

  const getIcon = (fuel: string) => {
    for (const [key, icon] of Object.entries(fuelIcons)) {
      if (fuel.includes(key) || fuel.toLowerCase().includes(key.toLowerCase())) {
        return icon;
      }
    }
    return "⛽";
  };

  return (
    <div>
      <h3 style={{ color: colors.accent, marginBottom: 12 }}>{t.panels.fuelFilter}</h3>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {availableFuels.map((fuel) => {
          const isSelected = selectedFuels.includes(fuel);
          
          return (
            <button
              key={fuel}
              onClick={() => onToggleFuel(fuel)}
              style={{
                background: isSelected 
                  ? `linear-gradient(135deg, ${colors.accent}33, ${colors.accent}11)`
                  : colors.chartBg,
                border: `1px solid ${isSelected ? colors.accent : colors.border}`,
                borderRadius: 8,
                padding: "10px 12px",
                color: colors.text,
                cursor: "pointer",
                fontSize: 13,
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                transition: "all 0.2s"
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 16 }}>{getIcon(fuel)}</span>
                <span style={{ fontWeight: isSelected ? 600 : 400 }}>
                  {fuel}
                </span>
              </span>
              
              <span style={{ 
                fontSize: 18,
                color: isSelected ? colors.accent : colors.textSecondary 
              }}>
                {isSelected ? "✓" : "○"}
              </span>
            </button>
          );
        })}
      </div>

      <div style={{ 
        marginTop: 12, 
        padding: 8, 
        background: `${colors.textSecondary}11`,
        borderRadius: 6,
        fontSize: 11,
        color: colors.textSecondary,
        textAlign: "center"
      }}>
        {selectedFuels.length} {t.filter.of} {availableFuels.length} {t.filter.selected}
      </div>
    </div>
  );
}
