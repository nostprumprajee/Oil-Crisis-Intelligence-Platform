"use client";

import { useEffect, useState } from "react";
import OilChart from "@/components/OilChart";
import { transformData } from "@/utils/transform";
import Ticker from "@/components/Ticker";

export default function Home() {
  const [data, setData] = useState<any[]>([]);
  const [latest, setLatest] = useState<any[]>([]);
  const [prevLatest, setPrevLatest] = useState<any[]>([]);
  const [prediction, setPrediction] = useState<number[]>([]);

  // const fetchData = () => {
  //   fetch("http://localhost:8000/thai-oil/history")
  //     .then(res => res.json())
  //     .then(raw => {
  //       setData(transformData(raw));
  //       setLatest(raw[0]?.prices || []);
  //     });
  // };
  const fetchData = () => {
  fetch("http://localhost:8000/thai-oil/history")
    .then(res => res.json())
    .then(raw => {
      setData(transformData(raw));

      // 🔥 เก็บค่าเก่า
      setPrevLatest(latest);

      // 🔥 ค่าใหม่
      setLatest(raw[0]?.prices || []);
    });
};
  const getPriceChange = (fuel: string, price: number) => {
    const prev = prevLatest.find(p => p.fuel === fuel);
    if (!prev) return "neutral";
  
    if (price > prev.price) return "up";
    if (price < prev.price) return "down";
    return "same";
  };

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
      <div style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: 16
      }}>

        {/* 📊 CHART */}
        <OilChart data={data} />

        {/* 💹 LATEST */}
        <div style={{
          background: "#0a0a0a",
          padding: 16,
          borderRadius: 10,
          border: "1px solid #222"
        }}>
          <h3 style={{ color: "#facc15" }}>Latest Prices</h3>

          {latest.map((item, i) => (
            <div key={i} style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "6px 0",
              borderBottom: "1px solid #111"
            }}>
              <span>{item.fuel}</span>
              <span style={{ color: "#22c55e" }}>
                {item.price}
              </span>
            </div>
          ))}
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