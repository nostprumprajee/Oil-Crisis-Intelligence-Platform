export interface AccuracyMetrics {
  mae: number; // Mean Absolute Error
  rmse: number; // Root Mean Square Error
  mape: number; // Mean Absolute Percentage Error
  accuracy: number; // Accuracy percentage (100 - MAPE)
  dataPoints: number;
}

export function calculateAccuracy(
  actual: number[],
  predicted: number[]
): AccuracyMetrics {
  if (!actual.length || !predicted.length || actual.length !== predicted.length) {
    return {
      mae: 0,
      rmse: 0,
      mape: 0,
      accuracy: 0,
      dataPoints: 0
    };
  }

  const n = actual.length;
  let sumAbsError = 0;
  let sumSquaredError = 0;
  let sumPercentError = 0;

  for (let i = 0; i < n; i++) {
    const error = Math.abs(actual[i] - predicted[i]);
    const squaredError = Math.pow(actual[i] - predicted[i], 2);
    const percentError = actual[i] !== 0 ? (error / Math.abs(actual[i])) * 100 : 0;

    sumAbsError += error;
    sumSquaredError += squaredError;
    sumPercentError += percentError;
  }

  const mae = sumAbsError / n;
  const rmse = Math.sqrt(sumSquaredError / n);
  const mape = sumPercentError / n;
  const accuracy = Math.max(0, 100 - mape);

  return {
    mae: Number(mae.toFixed(3)),
    rmse: Number(rmse.toFixed(3)),
    mape: Number(mape.toFixed(2)),
    accuracy: Number(accuracy.toFixed(2)),
    dataPoints: n
  };
}

export function extractHistoricalPredictions(data: any[]): {
  diesel: { actual: number[]; predicted: number[] };
  gasohol95: { actual: number[]; predicted: number[] };
} {
  const diesel = { actual: [] as number[], predicted: [] as number[] };
  const gasohol95 = { actual: [] as number[], predicted: [] as number[] };

  for (const item of data) {
    // Only include points where we have both actual and predicted values
    if (item.Diesel !== undefined && item.Diesel_pred !== undefined) {
      diesel.actual.push(item.Diesel);
      diesel.predicted.push(item.Diesel_pred);
    }

    if (item.Gasohol95 !== undefined && item.Gasohol95_pred !== undefined) {
      gasohol95.actual.push(item.Gasohol95);
      gasohol95.predicted.push(item.Gasohol95_pred);
    }
  }

  return { diesel, gasohol95 };
}

export function getAccuracyColor(accuracy: number): string {
  if (accuracy >= 95) return "#22c55e"; // Green - Excellent
  if (accuracy >= 90) return "#84cc16"; // Light green - Very good
  if (accuracy >= 85) return "#facc15"; // Yellow - Good
  if (accuracy >= 80) return "#fb923c"; // Orange - Fair
  return "#ef4444"; // Red - Poor
}

export function getAccuracyLabel(accuracy: number, language: "en" | "th"): string {
  const labels = {
    en: {
      excellent: "Excellent",
      veryGood: "Very Good",
      good: "Good",
      fair: "Fair",
      poor: "Poor"
    },
    th: {
      excellent: "ยอดเยี่ยม",
      veryGood: "ดีมาก",
      good: "ดี",
      fair: "พอใช้",
      poor: "ต่ำ"
    }
  };

  const lang = labels[language];

  if (accuracy >= 95) return lang.excellent;
  if (accuracy >= 90) return lang.veryGood;
  if (accuracy >= 85) return lang.good;
  if (accuracy >= 80) return lang.fair;
  return lang.poor;
}
