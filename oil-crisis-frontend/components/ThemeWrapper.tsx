"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { useEffect } from "react";

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();

  useEffect(() => {
    // Apply theme colors to body
    document.body.style.background = colors.bg;
    document.body.style.color = colors.text;
  }, [colors]);

  return <>{children}</>;
}
