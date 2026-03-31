"use client";

import { useEffect, useState } from "react";
import OilChart from "@/components/OilChart";
import { transformData } from "@/utils/transform";

export default function Home() {
  const [data, setData] = useState<any[]>([]);
  const [latest, setLatest] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/thai-oil/history")
      .then(res => res.json())
      .then(raw => {
        setData(transformData(raw));
        setLatest(raw[0]?.prices || []);
      });
  }, []);

  return (
    <div style={{
      background: "#050505",
      minHeight: "100vh",
      color: "white",
      padding: 20
    }}>
      <h1 style={{ color: "#facc15" }}>
        🛢️ Oil Crisis Intelligence
      </h1>

      {/* 🔥 Latest Price Panel */}
      <div style={{
        display: "flex",
        gap: 20,
        marginBottom: 20,
        flexWrap: "wrap"
      }}>
        {latest.map((item, i) => (
          <div key={i} style={{
            background: "#111",
            padding: 15,
            borderRadius: 10,
            border: "1px solid #222",
            minWidth: 150
          }}>
            <div style={{ fontSize: 12, color: "#888" }}>
              {item.fuel}
            </div>
            <div style={{
              fontSize: 20,
              color: "#22c55e"
            }}>
              {item.price}
            </div>
          </div>
        ))}
      </div>

      {/* 🔥 Chart */}
      <OilChart data={data} />
    </div>
  );
}