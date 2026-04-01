"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { TrendData, PriceStats, getTrendLabel } from "@/utils/trends";

interface TrendPanelProps {
  fuelName: string;
  icon: string;
  dailyTrend: TrendData;
  weeklyTrend: TrendData | null;
  stats: PriceStats;
}

export default function TrendPanel({ 
  fuelName, 
  icon, 
  dailyTrend, 
  weeklyTrend,
  stats 
}: TrendPanelProps) {
  const { colors } = useTheme();
  const { language } = useLanguage();

  const TrendBadge = ({ trend, period }: { trend: TrendData; period: string }) => (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 6,
      padding: "6px 10px",
      background: `${trend.color}22`,
      border: `1px solid ${trend.color}44`,
      borderRadius: 6,
      fontSize: 12
    }}>
      <span style={{ fontSize: 16 }}>{trend.arrow}</span>
      <div>
        <div style={{ fontWeight: 600, color: trend.color }}>
          {trend.changePercent > 0 ? "+" : ""}{trend.changePercent}%
        </div>
        <div style={{ fontSize: 10, color: colors.textSecondary }}>
          {period}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{
      background: colors.chartBg,
      border: `1px solid ${colors.border}`,
      borderRadius: 8,
      padding: 12,
      flex: 1
    }}>
      {/* Header */}
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: 8,
        marginBottom: 12,
        paddingBottom: 8,
        borderBottom: `1px solid ${colors.border}`
      }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <span style={{ fontWeight: 600, fontSize: 14 }}>{fuelName}</span>
      </div>

      {/* Current Price */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: colors.textSecondary, marginBottom: 4 }}>
          {language === "en" ? "Current Price" : "ราคาปัจจุบัน"}
        </div>
        <div style={{ 
          fontSize: 28, 
          fontWeight: 700,
          color: colors.text
        }}>
          ฿{stats.current}
        </div>
      </div>

      {/* Trends */}
      <div style={{ 
        display: "flex", 
        gap: 8,
        marginBottom: 12
      }}>
        <TrendBadge 
          trend={dailyTrend} 
          period={language === "en" ? "Daily" : "รายวัน"} 
        />
        {weeklyTrend && (
          <TrendBadge 
            trend={weeklyTrend} 
            period={language === "en" ? "Weekly" : "รายสัปดาห์"} 
          />
        )}
      </div>

      {/* Stats Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 8,
        fontSize: 11
      }}>
        <div style={{
          padding: 8,
          background: `${colors.up}11`,
          borderRadius: 6
        }}>
          <div style={{ color: colors.textSecondary, marginBottom: 4 }}>
            {language === "en" ? "Highest" : "สูงสุด"}
          </div>
          <div style={{ fontWeight: 600, color: colors.up, fontSize: 14 }}>
            ฿{stats.highest}
          </div>
          {stats.highestDate && (
            <div style={{ fontSize: 9, color: colors.textSecondary, marginTop: 2 }}>
              {stats.highestDate}
            </div>
          )}
        </div>

        <div style={{
          padding: 8,
          background: `${colors.down}11`,
          borderRadius: 6
        }}>
          <div style={{ color: colors.textSecondary, marginBottom: 4 }}>
            {language === "en" ? "Lowest" : "ต่ำสุด"}
          </div>
          <div style={{ fontWeight: 600, color: colors.down, fontSize: 14 }}>
            ฿{stats.lowest}
          </div>
          {stats.lowestDate && (
            <div style={{ fontSize: 9, color: colors.textSecondary, marginTop: 2 }}>
              {stats.lowestDate}
            </div>
          )}
        </div>

        <div style={{
          padding: 8,
          background: `${colors.textSecondary}11`,
          borderRadius: 6,
          gridColumn: "1 / -1"
        }}>
          <div style={{ color: colors.textSecondary, marginBottom: 4 }}>
            {language === "en" ? "Average" : "เฉลี่ย"}
          </div>
          <div style={{ fontWeight: 600, color: colors.text, fontSize: 14 }}>
            ฿{stats.average}
          </div>
        </div>
      </div>
    </div>
  );
}
