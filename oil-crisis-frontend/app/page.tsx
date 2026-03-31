"use client";

import { useEffect, useState } from "react";

type ThaiOil = {
  fuel: string;
  price: string;
};

export default function Home() {
  const [price, setPrice] = useState<number>(0);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [thaiOil, setThaiOil] = useState<ThaiOil[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAll();

    const interval = setInterval(fetchPrice, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchPrice(), fetchThaiOil()]);
    } catch (err) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const fetchPrice = async () => {
    const res = await fetch("/api/oil"); // ✅ ใช้ proxy
    const data = await res.json();
    setPrice(Number(data.price));
  };

  const fetchThaiOil = async () => {
  const res = await fetch("/api/thai-oil");
  const data = await res.json();

  console.log("thaiOil API:", data); // 👈 สำคัญ

  setThaiOil(data);
};

  const runSimulation = async () => {
    const res = await fetch("/api/simulate"); // ✅ proxy
    const data = await res.json();
    setPrediction(data.predicted_price);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🛢️ Oil Crisis Intelligence</h1>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* 🌍 Global Price */}
      <h2>🌍 Global Oil Price</h2>
      <h3>${price}</h3>

      {price > 115 && (
        <h3 style={{ color: "red" }}>
          🚨 Critical oil price level!
        </h3>
      )}

      {/* 🇹🇭 Thai Oil */}
      <h2>🇹🇭 Thai Oil Prices</h2>

      {thaiOil.length === 0 && !loading && <p>No data</p>}

      {thaiOil.map((item, i) => (
        <div key={i}>
          {item.fuel}: {item.price}
        </div>
      ))}

      {/* 🧠 Simulation */}
      <h2>🧠 Simulation</h2>

      <button onClick={runSimulation}>
        Run Simulation
      </button>

      {prediction && (
        <h3>📊 Predicted Price: ${prediction}</h3>
      )}
    </div>
  );
}