"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import TrendPanel from "@/components/TrendPanel";
import { TrendData, PriceStats } from "@/utils/trends";

interface TrendsContainerProps {
  dieselDaily: TrendData;
  dieselWeekly: TrendData | null;
  dieselStats: PriceStats;
  gasohol95Daily: TrendData;
  gasohol95Weekly: TrendData | null;
  gasohol95Stats: PriceStats;
}

export default function TrendsContainer({
  dieselDaily,
  dieselWeekly,
  dieselStats,
  gasohol95Daily,
  gasohol95Weekly,
  gasohol95Stats
}: TrendsContainerProps) {
  const { colors } = useTheme();
  const { language, t } = useLanguage();

  return (
    <div>
      <h3 style={{ color: colors.accent, marginBottom: 12 }}>
        {language === "en" ? "📈 Trend Analysis" : "📈 การวิเคราะห์แนวโน้ม"}
      </h3>

      <div style={{ display: "flex", gap: 10 }}>
        <TrendPanel
          fuelName={t.chart.diesel}
          icon="🚛"
          dailyTrend={dieselDaily}
          weeklyTrend={dieselWeekly}
          stats={dieselStats}
        />
        <TrendPanel
          fuelName={t.chart.gasohol95}
          icon="🚗"
          dailyTrend={gasohol95Daily}
          weeklyTrend={gasohol95Weekly}
          stats={gasohol95Stats}
        />
      </div>
    </div>
  );
}
