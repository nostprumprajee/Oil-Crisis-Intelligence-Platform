export interface VolatilityData {
  volatility: number; // Standard deviation
  riskLevel: "low" | "medium" | "high";
  riskScore: number; // 0-100
  coefficient: number; // Coefficient of variation (%)
  priceRange: number;
  recommendation: string;
}

export function calculateVolatility(prices: number[]): VolatilityData {
  if (prices.length < 2) {
    return {
      volatility: 0,
      riskLevel: "low",
      riskScore: 0,
      coefficient: 0,
      priceRange: 0,
      recommendation: "insufficient_data"
    };
  }

  // Calculate mean
  const mean = prices.reduce((a, b) => a + b, 0) / prices.length;

  // Calculate standard deviation
  const squaredDiffs = prices.map(price => Math.pow(price - mean, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / prices.length;
  const volatility = Math.sqrt(variance);

  // Calculate coefficient of variation (CV)
  const coefficient = mean !== 0 ? (volatility / mean) * 100 : 0;

  // Calculate price range
  const highest = Math.max(...prices);
  const lowest = Math.min(...prices);
  const priceRange = highest - lowest;

  // Determine risk level based on coefficient of variation
  let riskLevel: "low" | "medium" | "high";
  let riskScore: number;
  let recommendation: string;

  if (coefficient < 2) {
    riskLevel = "low";
    riskScore = Math.min(coefficient * 16.67, 33); // 0-33
    recommendation = "stable";
  } else if (coefficient < 4) {
    riskLevel = "medium";
    riskScore = 33 + ((coefficient - 2) * 16.67); // 33-66
    recommendation = "moderate";
  } else {
    riskLevel = "high";
    riskScore = Math.min(66 + ((coefficient - 4) * 8.5), 100); // 66-100
    recommendation = "volatile";
  }

  return {
    volatility: Number(volatility.toFixed(3)),
    riskLevel,
    riskScore: Number(riskScore.toFixed(1)),
    coefficient: Number(coefficient.toFixed(2)),
    priceRange: Number(priceRange.toFixed(2)),
    recommendation
  };
}

export function getRiskColor(riskLevel: "low" | "medium" | "high"): string {
  const colors = {
    low: "#22c55e",
    medium: "#facc15",
    high: "#ef4444"
  };
  return colors[riskLevel];
}

export function getRiskLabel(riskLevel: "low" | "medium" | "high", language: "en" | "th"): string {
  const labels = {
    en: {
      low: "Low Risk",
      medium: "Medium Risk",
      high: "High Risk"
    },
    th: {
      low: "ความเสี่ยงต่ำ",
      medium: "ความเสี่ยงปานกลาง",
      high: "ความเสี่ยงสูง"
    }
  };

  return labels[language][riskLevel];
}

export function getRecommendation(
  volatilityData: VolatilityData,
  currentPrice: number,
  average: number,
  language: "en" | "th"
): string {
  const recommendations = {
    en: {
      stable_below: "✅ Good time to refuel - Stable prices below average",
      stable_above: "⏳ Consider waiting - Stable but above average",
      moderate_below: "👍 Reasonable time to refuel - Moderate volatility",
      moderate_above: "⚠️ Prices fluctuating - Monitor closely",
      volatile_below: "🎯 Refuel now - High volatility, currently below average",
      volatile_above: "🚨 Wait if possible - High volatility and above average",
      insufficient: "📊 Insufficient data for recommendation"
    },
    th: {
      stable_below: "✅ เหมาะเติมเลย - ราคาคงที่และต่ำกว่าค่าเฉลี่ย",
      stable_above: "⏳ ควรรอ - ราคาคงที่แต่สูงกว่าค่าเฉลี่ย",
      moderate_below: "👍 เติมได้ - ความผันผวนปานกลาง",
      moderate_above: "⚠️ ราคาผันผวน - ติดตามอย่างใกล้ชิด",
      volatile_below: "🎯 เติมเลย - ความผันผวนสูง ราคาต่ำกว่าค่าเฉลี่ย",
      volatile_above: "🚨 รอก่อนถ้าได้ - ความผันผวนสูงและราคาสูงกว่าค่าเฉลี่ย",
      insufficient: "📊 ข้อมูลไม่เพียงพอสำหรับคำแนะนำ"
    }
  };

  const rec = recommendations[language];

  if (volatilityData.recommendation === "insufficient_data") {
    return rec.insufficient;
  }

  const isBelow = currentPrice < average;

  if (volatilityData.riskLevel === "low") {
    return isBelow ? rec.stable_below : rec.stable_above;
  } else if (volatilityData.riskLevel === "medium") {
    return isBelow ? rec.moderate_below : rec.moderate_above;
  } else {
    return isBelow ? rec.volatile_below : rec.volatile_above;
  }
}
