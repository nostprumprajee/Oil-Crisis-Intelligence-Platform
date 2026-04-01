export default function AlertPanel({ latest }: any) {
  const diesel = latest.find((l: any) =>
    l.fuel.includes("ดีเซล")
  );

  const alert = diesel && diesel.price > 41;

  return (
    <div>
      <h3 style={{ color: "#facc15" }}>Alerts</h3>

      {alert ? (
        <div style={{ color: "#ef4444", marginTop: 10 }}>
          🚨 Diesel price spike detected!
        </div>
      ) : (
        <div style={{ color: "#22c55e", marginTop: 10 }}>
          ✅ Market stable
        </div>
      )}
    </div>
  );
}