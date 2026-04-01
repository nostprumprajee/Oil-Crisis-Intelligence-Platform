"use client";

import { useTheme } from "@/contexts/ThemeContext";

export default function GlobalPanel() {
  const { colors } = useTheme();

  return (
    <div>
      <h3 style={{ color: colors.accent }}>Global Oil</h3>

      <div style={{ color: colors.textSecondary, marginTop: 10 }}>
        Brent: $86.12
      </div>
      <div style={{ color: colors.textSecondary }}>
        WTI: $82.45
      </div>
    </div>
  );
}