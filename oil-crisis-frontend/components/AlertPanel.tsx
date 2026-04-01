"use client";

import { useTheme } from "@/contexts/ThemeContext";

export default function AlertPanel({ latest }: any) {
  const { colors } = useTheme();
  
  const diesel = latest.find((l: any) =>
    l.fuel.includes("ดีเซล")
  );

  const alert = diesel && diesel.price > 41;

  return (
    <div>
      <h3 style={{ color: colors.accent }}>Alerts</h3>

      {alert ? (
        <div style={{ color: colors.down, marginTop: 10 }}>
          🚨 Diesel price spike detected!
        </div>
      ) : (
        <div style={{ color: colors.up, marginTop: 10 }}>
          ✅ Market stable
        </div>
      )}
    </div>
  );
}