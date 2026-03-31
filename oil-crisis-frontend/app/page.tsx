"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [price, setPrice] = useState<number>(0);
  const [prediction, setPrediction] = useState<number | null>(null);

  useEffect(() => {
    fetchPrice();
    const interval = setInterval(fetchPrice, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchPrice = async () => {
    const res = await fetch("http://localhost:3000/oil-price");
    const data = await res.json();
    setPrice(data.price);
  };

  const runSimulation = async () => {
    const res = await fetch("http://localhost:3000/simulate");
    const data = await res.json();
    setPrediction(data.predicted_price);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🛢️ Oil Crisis Intelligence</h1>

      <h2>Current Price: ${price}</h2>

      {price > 115 && (
        <h3 style={{ color: "red" }}>
          🚨 Critical oil price level!
        </h3>
      )}

      <button onClick={runSimulation}>
        Run Simulation
      </button>

      {prediction && (
        <h3>📊 Predicted Price: ${prediction}</h3>
      )}
    </div>
  );
  
}