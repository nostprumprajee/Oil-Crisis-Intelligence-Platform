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
  // const [prediction, setPrediction] = useState<number[]>([]);
  const [prediction, setPrediction] = useState({
  diesel: [],
  gasohol95: []
});

  const panelStyle = {
  background: "#0a0a0a",
  border: "1px solid #222",
  borderRadius: 10,
  padding: 12,
  overflow: "hidden"
};
  const fetchData = async () => {
  const res1 = await fetch("http://localhost:8000/thai-oil/history");
  const raw = await res1.json();

  const res2 = await fetch("http://localhost:8000/thai-oil/predict");
  const pred = await res2.json();

  setPrevLatest([...latest]);
  setLatest(raw[0]?.prices || []);

  setData(transformData(raw, pred)); // 🔥 ส่ง pred เข้าไป
};
  const getPriceChange = (fuel: string, price: number) => {
    const prev = prevLatest.find(p => p.fuel === fuel);
    if (!prev) return "neutral";
  
    if (price > prev.price) return "up";
    if (price < prev.price) return "down";
    return "same";
  };
  const mergePrediction = (data: any[], prediction: any) => {
  const sorted = [...data].reverse();

  const merged = [...sorted];

  prediction.diesel.forEach((p: number, i: number) => {
    if (!merged[i + sorted.length]) {
      merged.push({
        date: `+${i + 1}d`
      });
    }

    merged[sorted.length + i].Diesel_pred = p;
  });

  prediction.gasohol95.forEach((p: number, i: number) => {
    if (!merged[i + sorted.length]) {
      merged.push({
        date: `+${i + 1}d`
      });
    }

    merged[sorted.length + i].Gasohol95_pred = p;
  });

  return merged;
};

  const mergedData = mergePrediction(data, prediction);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // 🔥 realtime
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      background: "#050505",
      minHeight: "100vh",
      color: "white",
      padding: 16
    }}>
      {/* 🔥 HEADER */}
      <div style={{
        borderBottom: "1px solid #222",
        paddingBottom: 10,
        marginBottom: 16
      }}>
        <h1 style={{ color: "#facc15" }}>
          🛢️ Oil Crisis Intelligence Terminal
        </h1>
      </div>
      <Ticker data={latest} />

      {/* 🔥 GRID LAYOUT */}
      <div
  style={{
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gridTemplateRows: "400px 250px",
    gap: 12,
    height: "calc(100vh - 100px)"
  }}
>
  {/* 📊 MAIN CHART */}
  <div style={panelStyle}>
    <OilChart data={mergedData} />
  </div>

  {/* 💹 RIGHT TOP */}
  <div style={panelStyle}>
    <Ticker data={latest} />
    <LatestPanel latest={latest} getPriceChange={getPriceChange} />
  </div>

  {/* 🌍 BOTTOM LEFT */}
  <div style={panelStyle}>
    <GlobalPanel />
  </div>

  {/* 🚨 BOTTOM RIGHT */}
  <div style={panelStyle}>
    <AlertPanel latest={latest} />
  </div>
</div>

      {/* 🔥 TABLE */}
      <div style={{
        marginTop: 16,
        background: "#0a0a0a",
        padding: 16,
        borderRadius: 10,
        border: "1px solid #222"
      }}>
        <h3 style={{ color: "#facc15" }}>All Fuel Prices</h3>

        <table style={{ width: "100%", marginTop: 10 }}>
          <thead>
            <tr style={{ color: "#888", textAlign: "left" }}>
              <th>Fuel</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
  {latest.map((item, i) => {
    const change = getPriceChange(item.fuel, item.price);

    return (
      <tr
        key={i}
        className={change !== "same" ? "flash" : ""}
      >
        <td style={{ padding: "6px 0" }}>
          {item.fuel}
        </td>

        <td
          style={{
            color:
              change === "up"
                ? "#22c55e"
                : change === "down"
                ? "#ef4444"
                : "#aaa"
          }}
        >
          {item.price}
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