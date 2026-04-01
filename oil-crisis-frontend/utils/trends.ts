export interface TrendData {
  direction: "up" | "down" | "stable";
  changePercent: number;
  changeAmount: number;
  arrow: string;
  color: string;
  label: string;
}

export interface PriceStats {
  current: number;
  highest: number;
  lowest: number;
  average: number;
  highestDate?: string;
  lowestDate?: string;
}

export function calculateTrend(
  current: number,
  previous: number,
  threshold: number = 0.5
): TrendData {
  const changeAmount = current - previous;
  const changePercent = previous !== 0 ? (changeAmount / previous) * 100 : 0;

  let direction: "up" | "down" | "stable";
  let arrow: string;
  let color: string;
  let label: string;

  if (Math.abs(changePercent) < threshold) {
    direction = "stable";
    arrow = "→";
    color = "#9ca3af";
    label = "Stable";
  } else if (changeAmount > 0) {
    direction = "up";
    arrow = "↗️";
    color = "#ef4444";
    label = "Rising";
  } else {
    direction = "down";
    arrow = "↘️";
    color = "#22c55e";
    label = "Falling";
  }

  return {
    direction,
    changePercent: Number(changePercent.toFixed(2)),
    changeAmount: Number(changeAmount.toFixed(2)),
    arrow,
    color,
    label
  };
}

export function calculatePriceStats(
  data: any[],
  fuelKey: string
): PriceStats {
  const prices = data
    .filter(item => item[fuelKey] !== undefined)
    .map(item => ({ price: item[fuelKey], date: item.date }));

  if (prices.length === 0) {
    return {
      current: 0,
      highest: 0,
      lowest: 0,
      average: 0
    };
  }

  const priceValues = prices.map(p => p.price);
  const current = priceValues[priceValues.length - 1];
  const highest = Math.max(...priceValues);
  const lowest = Math.min(...priceValues);
  const average = priceValues.reduce((a, b) => a + b, 0) / priceValues.length;

  const highestItem = prices.find(p => p.price === highest);
  const lowestItem = prices.find(p => p.price === lowest);

  return {
    current: Number(current.toFixed(2)),
    highest: Number(highest.toFixed(2)),
    lowest: Number(lowest.toFixed(2)),
    average: Number(average.toFixed(2)),
    highestDate: highestItem?.date,
    lowestDate: lowestItem?.date
  };
}

export function getTrendLabel(trend: TrendData, language: "en" | "th"): string {
  const labels = {
    en: {
      up: "Rising",
      down: "Falling",
      stable: "Stable"
    },
    th: {
      up: "เพิ่มขึ้น",
      down: "ลดลง",
      stable: "คงที่"
    }
  };

  return labels[language][trend.direction];
}

export function getWeeklyTrend(data: any[], fuelKey: string): TrendData | null {
  const prices = data
    .filter(item => item[fuelKey] !== undefined)
    .map(item => item[fuelKey]);

  if (prices.length < 7) return null;

  const current = prices[prices.length - 1];
  const weekAgo = prices[prices.length - 7];

  return calculateTrend(current, weekAgo);
}

export function getMonthlyTrend(data: any[], fuelKey: string): TrendData | null {
  const prices = data
    .filter(item => item[fuelKey] !== undefined)
    .map(item => item[fuelKey]);

  if (prices.length < 30) return null;

  const current = prices[prices.length - 1];
  const monthAgo = prices[prices.length - 30];

  return calculateTrend(current, monthAgo);
}
