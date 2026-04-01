"use client";

import { useEffect, useState } from "react";
import OilChart from "@/components/OilChart";
import { transformData } from "@/utils/transform";
import Ticker from "@/components/Ticker";
import LatestPanel from "@/components/LatestPanel";
import GlobalPanel from "@/components/GlobalPanel";
import AlertPanel from "@/components/AlertPanel";
import ExportPanel from "@/components/ExportPanel";
import FuelFilter from "@/components/FuelFilter";
import AccuracyPanel from "@/components/AccuracyPanel";
import DateRangeSelector from "@/components/DateRangeSelector";
import TrendsContainer from "@/components/TrendsContainer";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { exportHistoricalData, exportLatestPrices } from "@/utils/export";
import { calculateAccuracy, extractHistoricalPredictions, AccuracyMetrics } from "@/utils/accuracy";
import { calculateTrend, calculatePriceStats, getWeeklyTrend } from "@/utils/trends";

export default function Home() {
  const { theme, toggleTheme, colors } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const [data, setData] = useState<any[]>([]);
  const [latest, setLatest] = useState<any[]>([]);
  const [prevLatest, setPrevLatest] = useState<any[]>([]);
  const [prediction, setPrediction] = useState<any>({
  diesel: { pred: [], low: [], high: [] },
  gasohol95: { pred: [], low: [], high: [] }
});
  const [selectedFuels, setSelectedFuels] = useState<string[]>(["Diesel", "Gasohol95"]);
  const [dateRange, setDateRange] = useState<number>(7);
  const [loading, setLoading] = useState<boolean>(false);

  // 🎨 Theme-aware panel style
  const panelStyle = {
    background: colors.panelBg,
    border: `1px solid ${colors.border}`,
    borderRadius: 12,
    padding: 14
  };

  // 🔥 FIX: fetch + set prediction ถูกต้อง
  const fetchData = async () => {
  setLoading(true);
  try {
    const [res1, res2] = await Promise.all([
      fetch(`http://localhost:8000/thai-oil/history?days=${dateRange}`),
      fetch(`http://localhost:8000/thai-oil/predict?days=${dateRange}`)
    ]);

    const raw = await res1.json();
    const predRaw = await res2.json();
    const pred = predRaw;

    setPrevLatest(latest);
    setLatest(raw[0]?.prices || []);
    setPrediction(pred);

    const transformed = transformData(raw, pred);
    setData(transformed);
  } catch (err) {
    console.error("fetch error", err);
  } finally {
    setLoading(false);
  }
};

  const getPriceChange = (fuel: string, price: number) => {
    const prev = prevLatest.find((p) => p.fuel === fuel);
    if (!prev) return "neutral";

    if (price > prev.price) return "up";
    if (price < prev.price) return "down";
    return "same";
  };

  // 🔥 FIX merge logic (ไม่มั่ว index)
  const mergePrediction = (data: any[], prediction: any) => {
  if (!data.length) return [];

  // ✅ sort timeline ให้ถูก
  const sorted = [...data].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const merged = [...sorted];

  const dieselPred = prediction?.diesel?.pred || [];
  const gasPred = prediction?.gasohol95?.pred || [];

  if (!dieselPred.length && !gasPred.length) return merged;

  // ✅ last actual point
  const last = sorted[sorted.length - 1];
  let lastDate = new Date(last.date);

  // 🔥 guard กันพัง
  if (isNaN(lastDate.getTime())) {
    console.warn("Invalid date detected:", last.date);

    // fallback = วันนี้
    lastDate = new Date();
  }

  const addDays = (date: Date, days: number) => {
  const d = new Date(date);

    if (isNaN(d.getTime())) {
      console.warn("Invalid base date");
      return "";
    }
  
    d.setDate(d.getDate() + days);
  
    return d.toISOString().slice(0, 10);
  };

  // 🔥 BRIDGE POINT (สำคัญมาก)
  merged.push({
    date: addDays(lastDate, 1),

    Diesel: last.Diesel,
    Gasohol95: last.Gasohol95,

    Diesel_pred: dieselPred[0],
    Gasohol95_pred: gasPred[0]
  });

  // 🔮 future points
  for (let i = 1; i < Math.max(dieselPred.length, gasPred.length); i++) {
    merged.push({
    date: addDays(lastDate, i + 1),
      
    Diesel_pred: dieselPred[i],
    Diesel_low: prediction.diesel.low[i],
    Diesel_high: prediction.diesel.high[i],
    Diesel_range: prediction.diesel.high[i] - prediction.diesel.low[i],
      
    Gasohol95_pred: gasPred[i],
    Gasohol95_low: prediction.gasohol95.low[i],
    Gasohol95_high: prediction.gasohol95.high[i],
    Gasohol95_range: prediction.gasohol95.high[i] - prediction.gasohol95.low[i]
  });
  }

  return merged;
};

  const mergedData = mergePrediction(data, prediction);
  
  // Calculate accuracy metrics
  const historicalData = extractHistoricalPredictions(mergedData);
  const dieselMetrics = calculateAccuracy(
    historicalData.diesel.actual,
    historicalData.diesel.predicted
  );
  const gasohol95Metrics = calculateAccuracy(
    historicalData.gasohol95.actual,
    historicalData.gasohol95.predicted
  );

  // Calculate trend indicators
  const dieselPrices = mergedData
    .filter(item => item.Diesel !== undefined)
    .map(item => item.Diesel);
  const gasohol95Prices = mergedData
    .filter(item => item.Gasohol95 !== undefined)
    .map(item => item.Gasohol95);

  const dieselDaily = dieselPrices.length >= 2
    ? calculateTrend(dieselPrices[dieselPrices.length - 1], dieselPrices[dieselPrices.length - 2])
    : { direction: "stable" as const, changePercent: 0, changeAmount: 0, arrow: "→", color: "#9ca3af", label: "Stable" };

  const gasohol95Daily = gasohol95Prices.length >= 2
    ? calculateTrend(gasohol95Prices[gasohol95Prices.length - 1], gasohol95Prices[gasohol95Prices.length - 2])
    : { direction: "stable" as const, changePercent: 0, changeAmount: 0, arrow: "→", color: "#9ca3af", label: "Stable" };

  const dieselWeekly = getWeeklyTrend(mergedData, "Diesel");
  const gasohol95Weekly = getWeeklyTrend(mergedData, "Gasohol95");

  const dieselStats = calculatePriceStats(mergedData, "Diesel");
  const gasohol95Stats = calculatePriceStats(mergedData, "Gasohol95");
  
  // Get available fuel types from latest data
  const availableFuels = Array.from(new Set(latest.map(item => item.fuel)));

  // Toggle fuel selection
  const toggleFuel = (fuel: string) => {
    setSelectedFuels(prev => {
      if (prev.includes(fuel)) {
        // Don't allow deselecting all fuels
        if (prev.length === 1) return prev;
        return prev.filter(f => f !== fuel);
      }
      return [...prev, fuel];
    });
  };

  // Filter data based on selected fuels
  const filteredLatest = latest.filter(item => 
    selectedFuels.some(fuel => item.fuel.includes(fuel))
  );
  
  console.log("merged data:", mergedData);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000); // 🔥 ลด load
    return () => clearInterval(interval);
  }, [dateRange]); // Re-fetch when date range changes

  return (
    <div
      style={{
        background: colors.bg,
        minHeight: "100vh",
        color: colors.text,
        padding: 16,
        fontFamily: "Inter, system-ui"
      }}
    >
      {/* 🔥 HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: `1px solid ${colors.border}`,
          paddingBottom: 12,
          marginBottom: 16
        }}
      >
        <h1 style={{ color: colors.accent, fontSize: 20 }}>
          {t.header.title}
        </h1>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => exportHistoricalData(mergedData)}
            style={{
              background: colors.panelBg,
              border: `1px solid ${colors.border}`,
              borderRadius: 8,
              padding: "6px 12px",
              color: colors.text,
              cursor: "pointer",
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              gap: 6
            }}
            title={t.buttons.exportCSV}
          >
            {t.buttons.exportCSV}
          </button>

          <button
            onClick={() => exportLatestPrices(filteredLatest)}
            style={{
              background: colors.panelBg,
              border: `1px solid ${colors.border}`,
              borderRadius: 8,
              padding: "6px 12px",
              color: colors.text,
              cursor: "pointer",
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              gap: 6
            }}
            title={t.buttons.latest}
          >
            {t.buttons.latest}
          </button>

          <button
            onClick={toggleLanguage}
            style={{
              background: colors.panelBg,
              border: `1px solid ${colors.border}`,
              borderRadius: 8,
              padding: "6px 12px",
              color: colors.text,
              cursor: "pointer",
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontWeight: 600
            }}
            title="Switch Language"
          >
            {language === "en" ? "🇹🇭 ไทย" : "🇬🇧 EN"}
          </button>

          <button
            onClick={toggleTheme}
            style={{
              background: colors.panelBg,
              border: `1px solid ${colors.border}`,
              borderRadius: 8,
              padding: "6px 12px",
              color: colors.text,
              cursor: "pointer",
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              gap: 6
            }}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          <div style={{ fontSize: 12, color: colors.textSecondary }}>
            {t.header.subtitle}
          </div>
        </div>
      </div>

      {/* 🔥 TICKER (เหลืออันเดียวพอ) */}
      <Ticker data={filteredLatest} />

      {/* 📅 DATE RANGE SELECTOR */}
      <div style={{ 
        marginBottom: 14,
        padding: 12,
        background: colors.panelBg,
        border: `1px solid ${colors.border}`,
        borderRadius: 10,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <DateRangeSelector 
          selectedDays={dateRange}
          onDaysChange={setDateRange}
        />
        
        {loading && (
          <div style={{ 
            fontSize: 12, 
            color: colors.accent,
            display: "flex",
            alignItems: "center",
            gap: 6
          }}>
            <span className="spinner">⏳</span>
            {language === "en" ? "Loading..." : "กำลังโหลด..."}
          </div>
        )}
      </div>

      {/* 🔥 GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gridTemplateRows: "500px auto auto auto",
          gap: 14
        }}
      >
        {/* 📊 CHART */}
        <div style={panelStyle}>
          <OilChart data={mergedData} selectedFuels={selectedFuels} />
        </div>

        {/* 💹 RIGHT TOP */}
        <div style={panelStyle}>
          <LatestPanel latest={filteredLatest} getPriceChange={getPriceChange} />
        </div>

        {/* 📈 TREND ANALYSIS */}
        <div style={{ ...panelStyle, gridColumn: "1 / -1" }}>
          <TrendsContainer
            dieselDaily={dieselDaily}
            dieselWeekly={dieselWeekly}
            dieselStats={dieselStats}
            gasohol95Daily={gasohol95Daily}
            gasohol95Weekly={gasohol95Weekly}
            gasohol95Stats={gasohol95Stats}
          />
        </div>

        {/* 🎯 ACCURACY METRICS */}
        <div style={panelStyle}>
          <AccuracyPanel 
            dieselMetrics={dieselMetrics}
            gasohol95Metrics={gasohol95Metrics}
          />
        </div>

        {/* 🌍 GLOBAL + 🚨 ALERT */}
        <div style={{ display: "flex", gap: 14 }}>
          <div style={{ ...panelStyle, flex: 1 }}>
            <GlobalPanel />
          </div>
          <div style={{ ...panelStyle, flex: 1 }}>
            <AlertPanel latest={filteredLatest} />
          </div>
        </div>

        {/* 🔍 FILTER + 📥 EXPORT */}
        <div style={{ display: "flex", gap: 14, gridColumn: "1 / -1" }}>
          <div style={{ ...panelStyle, flex: 1 }}>
            <FuelFilter 
              selectedFuels={selectedFuels}
              onToggleFuel={toggleFuel}
              availableFuels={availableFuels}
            />
          </div>
          <div style={{ ...panelStyle, flex: 1 }}>
            <ExportPanel data={mergedData} latest={filteredLatest} />
          </div>
        </div>
      </div>

      {/* 🔥 TABLE */}
      <div
        style={{
          marginTop: 16,
          ...panelStyle
        }}
      >
        <h3 style={{ color: colors.accent }}>{t.table.allFuelPrices}</h3>

        <table style={{ width: "100%", marginTop: 10 }}>
          <thead>
            <tr style={{ color: colors.textSecondary, textAlign: "left" }}>
              <th>{t.table.fuel}</th>
              <th>{t.table.price}</th>
            </tr>
          </thead>

          <tbody>
            {filteredLatest.map((item, i) => {
              const change = getPriceChange(item.fuel, item.price);

              return (
                <tr key={i} className={change !== "same" ? "flash" : ""}>
                  <td style={{ padding: "6px 0" }}>{item.fuel}</td>

                  <td
                    style={{
                      fontWeight: 600,
                      color:
                        change === "up"
                          ? colors.up
                          : change === "down"
                          ? colors.down
                          : colors.neutral
                    }}
                  >
                    {item.price.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}