"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { AccuracyMetrics, getAccuracyColor, getAccuracyLabel } from "@/utils/accuracy";

interface AccuracyPanelProps {
  dieselMetrics: AccuracyMetrics;
  gasohol95Metrics: AccuracyMetrics;
}

export default function AccuracyPanel({ dieselMetrics, gasohol95Metrics }: AccuracyPanelProps) {
  const { colors } = useTheme();
  const { language, t } = useLanguage();

  const MetricCard = ({ 
    title, 
    metrics, 
    icon 
  }: { 
    title: string; 
    metrics: AccuracyMetrics; 
    icon: string;
  }) => {
    const accuracyColor = getAccuracyColor(metrics.accuracy);
    const accuracyLabel = getAccuracyLabel(metrics.accuracy, language);

    return (
      <div
        style={{
          background: `linear-gradient(135deg, ${accuracyColor}11, transparent)`,
          border: `1px solid ${colors.border}`,
          borderRadius: 8,
          padding: 12,
          flex: 1
        }}
      >
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 8,
          marginBottom: 10
        }}>
          <span style={{ fontSize: 20 }}>{icon}</span>
          <span style={{ fontWeight: 600, fontSize: 14 }}>{title}</span>
        </div>

        {/* Accuracy Score */}
        <div style={{ 
          display: "flex", 
          alignItems: "baseline", 
          gap: 6,
          marginBottom: 8
        }}>
          <span style={{ 
            fontSize: 32, 
            fontWeight: 700,
            color: accuracyColor
          }}>
            {metrics.accuracy}%
          </span>
          <span style={{ 
            fontSize: 12, 
            color: colors.textSecondary,
            fontWeight: 500
          }}>
            {accuracyLabel}
          </span>
        </div>

        {/* Progress Bar */}
        <div style={{
          width: "100%",
          height: 6,
          background: colors.border,
          borderRadius: 3,
          overflow: "hidden",
          marginBottom: 10
        }}>
          <div style={{
            width: `${metrics.accuracy}%`,
            height: "100%",
            background: accuracyColor,
            transition: "width 0.5s ease"
          }} />
        </div>

        {/* Detailed Metrics */}
        <div style={{ 
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
          fontSize: 11,
          color: colors.textSecondary
        }}>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 2 }}>MAE</div>
            <div style={{ color: colors.text }}>{metrics.mae}</div>
          </div>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 2 }}>RMSE</div>
            <div style={{ color: colors.text }}>{metrics.rmse}</div>
          </div>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 2 }}>MAPE</div>
            <div style={{ color: colors.text }}>{metrics.mape}%</div>
          </div>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 2 }}>
              {language === "en" ? "Points" : "จุดข้อมูล"}
            </div>
            <div style={{ color: colors.text }}>{metrics.dataPoints}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h3 style={{ color: colors.accent, marginBottom: 12 }}>
        {language === "en" ? "🎯 Prediction Accuracy" : "🎯 ความแม่นยำการพยากรณ์"}
      </h3>

      <div style={{ display: "flex", gap: 10 }}>
        <MetricCard
          title={t.chart.diesel}
          metrics={dieselMetrics}
          icon="🚛"
        />
        <MetricCard
          title={t.chart.gasohol95}
          metrics={gasohol95Metrics}
          icon="🚗"
        />
      </div>

      <div style={{ 
        marginTop: 10, 
        padding: 8, 
        background: `${colors.textSecondary}11`,
        borderRadius: 6,
        fontSize: 10,
        color: colors.textSecondary,
        lineHeight: 1.4
      }}>
        {language === "en" 
          ? "💡 Accuracy based on historical predictions vs actual prices. MAE = Mean Absolute Error, RMSE = Root Mean Square Error, MAPE = Mean Absolute Percentage Error"
          : "💡 ความแม่นยำคำนวณจากการเปรียบเทียบการพยากรณ์กับราคาจริง MAE = ค่าเฉลี่ยความคลาดเคลื่อนสัมบูรณ์, RMSE = รากที่สองของค่าเฉลี่ยความคลาดเคลื่อนกำลังสอง, MAPE = เปอร์เซ็นต์ความคลาดเคลื่อนสัมบูรณ์เฉลี่ย"
        }
      </div>
    </div>
  );
}
