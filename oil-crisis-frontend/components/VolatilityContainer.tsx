"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import VolatilityPanel from "@/components/VolatilityPanel";
import { VolatilityData } from "@/utils/volatility";

interface VolatilityContainerProps {
  dieselVolatility: VolatilityData;
  dieselCurrent: number;
  dieselAverage: number;
  gasohol95Volatility: VolatilityData;
  gasohol95Current: number;
  gasohol95Average: number;
}

export default function VolatilityContainer({
  dieselVolatility,
  dieselCurrent,
  dieselAverage,
  gasohol95Volatility,
  gasohol95Current,
  gasohol95Average
}: VolatilityContainerProps) {
  const { colors } = useTheme();
  const { language, t } = useLanguage();

  return (
    <div>
      <h3 style={{ color: colors.accent, marginBottom: 12 }}>
        {language === "en" ? "📊 Volatility & Risk Analysis" : "📊 การวิเคราะห์ความผันผวนและความเสี่ยง"}
      </h3>

      <div style={{ display: "flex", gap: 10 }}>
        <VolatilityPanel
          fuelName={t.chart.diesel}
          icon="🚛"
          volatilityData={dieselVolatility}
          currentPrice={dieselCurrent}
          averagePrice={dieselAverage}
        />
        <VolatilityPanel
          fuelName={t.chart.gasohol95}
          icon="🚗"
          volatilityData={gasohol95Volatility}
          currentPrice={gasohol95Current}
          averagePrice={gasohol95Average}
        />
      </div>

      <div style={{
        marginTop: 10,
        padding: 10,
        background: `${colors.textSecondary}11`,
        borderRadius: 6,
        fontSize: 10,
        color: colors.textSecondary,
        lineHeight: 1.4
      }}>
        {language === "en"
          ? "💡 Risk score is calculated using price volatility (standard deviation) and coefficient of variation. Lower scores indicate more stable prices, while higher scores suggest greater price fluctuations."
          : "💡 คะแนนความเสี่ยงคำนวณจากความผันผวนของราคา (ส่วนเบี่ยงเบนมาตรฐาน) และสัมประสิทธิ์การแปรผัน คะแนนต่ำแสดงถึงราคาที่มีเสถียรภาพ ในขณะที่คะแนนสูงบ่งบอกถึงความผันผวนของราคามากขึ้น"
        }
      </div>
    </div>
  );
}
