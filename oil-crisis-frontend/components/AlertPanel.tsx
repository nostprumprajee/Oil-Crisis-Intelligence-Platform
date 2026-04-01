"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AlertPanel({ latest }: any) {
  const { colors } = useTheme();
  const { t } = useLanguage();
  
  const diesel = latest.find((l: any) =>
    l.fuel.includes("ดีเซล") || l.fuel.includes("Diesel")
  );

  const alert = diesel && diesel.price > 41;

  return (
    <div>
      <h3 style={{ color: colors.accent }}>{t.panels.alerts}</h3>

      {alert ? (
        <div style={{ color: colors.down, marginTop: 10 }}>
          {t.panels.alertSpike}
        </div>
      ) : (
        <div style={{ color: colors.up, marginTop: 10 }}>
          {t.panels.alertStable}
        </div>
      )}
    </div>
  );
}