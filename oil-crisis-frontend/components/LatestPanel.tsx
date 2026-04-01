export default function LatestPanel({ latest, getPriceChange }: any) {
  return (
    <div>
      <h3 style={{ color: "#facc15" }}>Latest Prices</h3>

      {latest.map((item: any, i: number) => {
        const change = getPriceChange(item.fuel, item.price);

        return (
          <div
            key={i}
            className={change !== "same" ? "flash" : ""}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "6px 0",
              borderBottom: "1px solid #111"
            }}
          >
            <span>{item.fuel}</span>

            <span
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
            </span>
          </div>
        );
      })}
    </div>
  );
}