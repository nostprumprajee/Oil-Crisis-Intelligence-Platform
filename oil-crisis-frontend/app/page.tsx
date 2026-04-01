"use client";

import { useEffect, useState } from "react";
import OilChart from "@/components/OilChart";
import { transformData } from "@/utils/transform";
import Ticker from "@/components/Ticker";
import LatestPanel from "@/components/LatestPanel";
import GlobalPanel from "@/components/GlobalPanel";
import AlertPanel from "@/components/AlertPanel";

export default function Home() {
  const [data, setData] = useState<any[]>([]);
  const [latest, setLatest] = useState<any[]>([]);
  const [prevLatest, setPrevLatest] = useState<any[]>([]);
  const [prediction, setPrediction] = useState<any>({
  diesel: { pred: [], low: [], high: [] },
  gasohol95: { pred: [], low: [], high: [] }
});

  // 🎨 NEW UI style (premium)
  const panelStyle = {
    background: "linear-gradient(145deg, #0a0f1a, #05070b)",
    border: "1px solid #1f2937",
    borderRadius: 12,
    padding: 14
  };

  // 🔥 FIX: fetch + set prediction ถูกต้อง
  const fetchData = async () => {
  try {
    const [res1, res2] = await Promise.all([
      fetch("http://localhost:8000/thai-oil/history"),
      fetch("http://localhost:8000/thai-oil/predict")
    ]);

    const raw = await res1.json();
    const predRaw = await res2.json();

    // 🔥 FIX: normalize prediction
    // const pred = {
    //   diesel: Array.isArray(predRaw.diesel)
    //     ? predRaw.diesel
    //     : typeof predRaw.diesel === "string"
    //     ? predRaw.diesel.split(",").map(Number)
    //     : [],

    //   gasohol95: Array.isArray(predRaw.gasohol95)
    //     ? predRaw.gasohol95
    //     : typeof predRaw.gasohol95 === "string"
    //     ? predRaw.gasohol95.split(",").map(Number)
    //     : []
    // };
    const pred = predRaw;

    setPrevLatest(latest);
    setLatest(raw[0]?.prices || []);
    setPrediction(pred);

    const transformed = transformData(raw, pred);
    setData(transformed);
  } catch (err) {
    console.error("fetch error", err);
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
      Gasohol95_pred: gasPred[i]
    });
  }

  return merged;
};

  const mergedData = mergePrediction(data, prediction);
  
  console.log("merged data:", mergedData);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000); // 🔥 ลด load
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        background: "#05070b",
        minHeight: "100vh",
        color: "#e5e7eb",
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
          borderBottom: "1px solid #1f2937",
          paddingBottom: 12,
          marginBottom: 16
        }}
      >
        <h1 style={{ color: "#facc15", fontSize: 20 }}>
          🛢️ Oil Crisis Intelligence Terminal
        </h1>

        <div style={{ fontSize: 12, color: "#9ca3af" }}>
          LIVE MARKET • THAILAND
        </div>
      </div>

      {/* 🔥 TICKER (เหลืออันเดียวพอ) */}
      <Ticker data={latest} />

      {/* 🔥 GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gridTemplateRows: "500px 280px",
          gap: 14
        }}
      >
        {/* 📊 CHART */}
        <div style={panelStyle}>
          <OilChart data={mergedData} />
        </div>

        {/* 💹 RIGHT */}
        <div style={panelStyle}>
          <LatestPanel latest={latest} getPriceChange={getPriceChange} />
        </div>

        {/* 🌍 GLOBAL */}
        <div style={panelStyle}>
          <GlobalPanel />
        </div>

        {/* 🚨 ALERT */}
        <div style={panelStyle}>
          <AlertPanel latest={latest} />
        </div>
      </div>

      {/* 🔥 TABLE */}
      <div
        style={{
          marginTop: 16,
          ...panelStyle
        }}
      >
        <h3 style={{ color: "#facc15" }}>All Fuel Prices</h3>

        <table style={{ width: "100%", marginTop: 10 }}>
          <thead>
            <tr style={{ color: "#9ca3af", textAlign: "left" }}>
              <th>Fuel</th>
              <th>Price</th>
            </tr>
          </thead>

          <tbody>
            {latest.map((item, i) => {
              const change = getPriceChange(item.fuel, item.price);

              return (
                <tr key={i} className={change !== "same" ? "flash" : ""}>
                  <td style={{ padding: "6px 0" }}>{item.fuel}</td>

                  <td
                    style={{
                      fontWeight: 600,
                      color:
                        change === "up"
                          ? "#22c55e"
                          : change === "down"
                          ? "#ef4444"
                          : "#e5e7eb"
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