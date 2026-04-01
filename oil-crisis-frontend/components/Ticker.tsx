"use client";

import { useTheme } from "@/contexts/ThemeContext";

export default function Ticker({ data }: { data: any[] }) {
  const { colors } = useTheme();

  return (
    <div style={{
      overflow: "hidden",
      whiteSpace: "nowrap",
      borderTop: `1px solid ${colors.border}`,
      borderBottom: `1px solid ${colors.border}`,
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
            <span style={{ color: colors.up }}>
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