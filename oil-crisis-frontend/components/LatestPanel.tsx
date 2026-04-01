"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

export default function LatestPanel({ latest, getPriceChange }: any) {
  const { colors } = useTheme();
  const { t } = useLanguage();

  return (
    <div>
      <h3 style={{ color: colors.accent }}>{t.panels.latestPrices}</h3>

      {latest.map((item: any, i: number) => {
        const change = getPriceChange(item.fuel, item.price);

        return (
          <div
            key={i}
            className={change !== "same" ? "flash" : ""}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "6px 0",
              borderBottom: `1px solid ${colors.border}`
            }}
          >
            <span>{item.fuel}</span>

            <span
              style={{
                color:
                  change === "up"
                    ? colors.up
                    : change === "down"
                    ? colors.down
                    : colors.textSecondary
              }}
            >
              {item.price}
            </span>
          </div>
        );
      })}
    </div>
  );
}