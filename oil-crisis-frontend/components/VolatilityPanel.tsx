"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { VolatilityData, getRiskColor, getRiskLabel, getRecommendation } from "@/utils/volatility";

interface VolatilityPanelProps {
  fuelName: string;
  icon: string;
  volatilityData: VolatilityData;
  currentPrice: number;
  averagePrice: number;
}

export default function VolatilityPanel({
  fuelName,
  icon,
  volatilityData,
  currentPrice,
  averagePrice
}: VolatilityPanelProps) {
  const { colors } = useTheme();
  const { language } = useLanguage();

  const riskColor = getRiskColor(volatilityData.riskLevel);
  const riskLabel = getRiskLabel(volatilityData.riskLevel, language);
  const recommendation = getRecommendation(volatilityData, currentPrice, averagePrice, language);

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

      {/* Risk Score Circle */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12
      }}>
        <div style={{
          position: "relative",
          width: 100,
          height: 100
        }}>
          {/* Background circle */}
          <svg width="100" height="100" style={{ transform: "rotate(-90deg)" }}>
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={colors.border}
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={riskColor}
              strokeWidth="8"
              strokeDasharray={`${(volatilityData.riskScore / 100) * 251.2} 251.2`}
              strokeLinecap="round"
            />
          </svg>
          
          {/* Center text */}
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center"
          }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: riskColor }}>
              {volatilityData.riskScore}
            </div>
            <div style={{ fontSize: 9, color: colors.textSecondary }}>
              {language === "en" ? "Risk" : "ความเสี่ยง"}
            </div>
          </div>
        </div>
      </div>

      {/* Risk Level Badge */}
      <div style={{
        textAlign: "center",
        marginBottom: 12
      }}>
        <div style={{
          display: "inline-block",
          padding: "6px 12px",
          background: `${riskColor}22`,
          border: `1px solid ${riskColor}`,
          borderRadius: 6,
          fontSize: 12,
          fontWeight: 600,
          color: riskColor
        }}>
          {riskLabel}
        </div>
      </div>

      {/* Metrics */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 8,
        marginBottom: 12,
        fontSize: 11
      }}>
        <div style={{
          padding: 8,
          background: `${colors.textSecondary}11`,
          borderRadius: 6
        }}>
          <div style={{ color: colors.textSecondary, marginBottom: 4 }}>
            {language === "en" ? "Volatility" : "ความผันผวน"}
          </div>
          <div style={{ fontWeight: 600, color: colors.text }}>
            ฿{volatilityData.volatility}
          </div>
        </div>

        <div style={{
          padding: 8,
          background: `${colors.textSecondary}11`,
          borderRadius: 6
        }}>
          <div style={{ color: colors.textSecondary, marginBottom: 4 }}>
            {language === "en" ? "CV" : "สัมประสิทธิ์"}
          </div>
          <div style={{ fontWeight: 600, color: colors.text }}>
            {volatilityData.coefficient}%
          </div>
        </div>

        <div style={{
          padding: 8,
          background: `${colors.textSecondary}11`,
          borderRadius: 6,
          gridColumn: "1 / -1"
        }}>
          <div style={{ color: colors.textSecondary, marginBottom: 4 }}>
            {language === "en" ? "Price Range" : "ช่วงราคา"}
          </div>
          <div style={{ fontWeight: 600, color: colors.text }}>
            ฿{volatilityData.priceRange}
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <div style={{
        padding: 10,
        background: `${riskColor}11`,
        border: `1px solid ${riskColor}33`,
        borderRadius: 6,
        fontSize: 11,
        lineHeight: 1.5,
        color: colors.text
      }}>
        {recommendation}
      </div>
    </div>
  );
}
