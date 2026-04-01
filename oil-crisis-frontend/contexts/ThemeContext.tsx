"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: {
    bg: string;
    panelBg: string;
    border: string;
    text: string;
    textSecondary: string;
    accent: string;
    chartBg: string;
    up: string;
    down: string;
    neutral: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const saved = localStorage.getItem("oil-theme") as Theme;
    if (saved) setTheme(saved);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("oil-theme", newTheme);
  };

  const colors = theme === "dark" 
    ? {
        bg: "#05070b",
        panelBg: "#0a0f1a",
        border: "#1f2937",
        text: "#e5e7eb",
        textSecondary: "#9ca3af",
        accent: "#facc15",
        chartBg: "#0a0a0a",
        up: "#22c55e",
        down: "#ef4444",
        neutral: "#e5e7eb"
      }
    : {
        bg: "#f9fafb",
        panelBg: "#ffffff",
        border: "#e5e7eb",
        text: "#111827",
        textSecondary: "#6b7280",
        accent: "#f59e0b",
        chartBg: "#ffffff",
        up: "#16a34a",
        down: "#dc2626",
        neutral: "#111827"
      };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
