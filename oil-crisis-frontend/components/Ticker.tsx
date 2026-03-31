"use client";

export default function Ticker({ data }: { data: any[] }) {
  return (
    <div style={{
      overflow: "hidden",
      whiteSpace: "nowrap",
      borderTop: "1px solid #222",
      borderBottom: "1px solid #222",
      padding: "6px 0",
      marginBottom: 10
    }}>
      <div style={{
        display: "inline-block",
        animation: "scroll 20s linear infinite"
      }}>
        {data.map((item, i) => (
          <span key={i} style={{ marginRight: 40 }}>
            {item.fuel}: 
            <span style={{ color: "#22c55e" }}>
              {item.price}
            </span>
          </span>
        ))}
      </div>

      <style jsx>{`
        @keyframes scroll {
          from { transform: translateX(100%); }
          to { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}