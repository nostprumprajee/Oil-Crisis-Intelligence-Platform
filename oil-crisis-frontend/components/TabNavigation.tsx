"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

export type TabType = "overview" | "analysis" | "alerts" | "settings";

interface Tab {
  id: TabType;
  icon: string;
  labelEn: string;
  labelTh: string;
}

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const { colors } = useTheme();
  const { language } = useLanguage();

  const tabs: Tab[] = [
    { id: "overview", icon: "📊", labelEn: "Overview", labelTh: "ภาพรวม" },
    { id: "analysis", icon: "📈", labelEn: "Analysis", labelTh: "วิเคราะห์" },
    { id: "alerts", icon: "🔔", labelEn: "Alerts", labelTh: "แจ้งเตือน" },
    { id: "settings", icon: "⚙️", labelEn: "Settings", labelTh: "ตั้งค่า" }
  ];

  return (
    <div style={{
      display: "flex",
      gap: 8,
      padding: "8px 0",
      borderBottom: `2px solid ${colors.border}`,
      marginBottom: 20
    }}>
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        const label = language === "en" ? tab.labelEn : tab.labelTh;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 20px",
              background: isActive ? `${colors.accent}22` : "transparent",
              border: "none",
              borderBottom: isActive ? `3px solid ${colors.accent}` : "3px solid transparent",
              borderRadius: "8px 8px 0 0",
              color: isActive ? colors.accent : colors.textSecondary,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: isActive ? 600 : 400,
              transition: "all 0.3s ease",
              marginBottom: -2
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = `${colors.textSecondary}11`;
                e.currentTarget.style.color = colors.text;
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = colors.textSecondary;
              }
            }}
          >
            <span style={{ fontSize: 18 }}>{tab.icon}</span>
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
