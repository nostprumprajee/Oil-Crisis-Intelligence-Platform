"use client";

import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { PriceAlert, getAlertLabel } from "@/utils/alerts";

interface AlertsPanelProps {
  alerts: PriceAlert[];
  onAddAlert: (fuelType: string, targetPrice: number, condition: "above" | "below") => void;
  onDeleteAlert: (id: string) => void;
  onToggleAlert: (id: string) => void;
  availableFuels: string[];
}

export default function AlertsPanel({
  alerts,
  onAddAlert,
  onDeleteAlert,
  onToggleAlert,
  availableFuels
}: AlertsPanelProps) {
  const { colors } = useTheme();
  const { language } = useLanguage();

  const [selectedFuel, setSelectedFuel] = useState<string>(availableFuels[0] || "");
  const [targetPrice, setTargetPrice] = useState<string>("");
  const [condition, setCondition] = useState<"above" | "below">("below");
  const [showForm, setShowForm] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const price = parseFloat(targetPrice);
    if (isNaN(price) || price <= 0) {
      alert(language === "en" ? "Please enter a valid price" : "กรุณาใส่ราคาที่ถูกต้อง");
      return;
    }

    onAddAlert(selectedFuel, price, condition);
    setTargetPrice("");
    setShowForm(false);
  };

  const activeAlerts = alerts.filter(a => a.isActive);
  const triggeredAlerts = alerts.filter(a => !a.isActive);

  return (
    <div>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: 12
      }}>
        <h3 style={{ color: colors.accent, margin: 0 }}>
          {language === "en" ? "🔔 Price Alerts" : "🔔 แจ้งเตือนราคา"}
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            background: colors.accent,
            border: "none",
            borderRadius: 6,
            padding: "6px 12px",
            color: "#000",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 600
          }}
        >
          {showForm ? "✕" : "+ " + (language === "en" ? "New Alert" : "สร้างแจ้งเตือน")}
        </button>
      </div>

      {/* Add Alert Form */}
      {showForm && (
        <form onSubmit={handleSubmit} style={{
          background: `${colors.accent}11`,
          border: `1px solid ${colors.border}`,
          borderRadius: 8,
          padding: 12,
          marginBottom: 12
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div>
              <label style={{ fontSize: 11, color: colors.textSecondary, display: "block", marginBottom: 4 }}>
                {language === "en" ? "Fuel Type" : "ชนิดน้ำมัน"}
              </label>
              <select
                value={selectedFuel}
                onChange={(e) => setSelectedFuel(e.target.value)}
                style={{
                  width: "100%",
                  padding: "6px 8px",
                  background: colors.chartBg,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 6,
                  color: colors.text,
                  fontSize: 12
                }}
              >
                {availableFuels.map(fuel => (
                  <option key={fuel} value={fuel}>{fuel}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: 11, color: colors.textSecondary, display: "block", marginBottom: 4 }}>
                {language === "en" ? "Condition" : "เงื่อนไข"}
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as "above" | "below")}
                style={{
                  width: "100%",
                  padding: "6px 8px",
                  background: colors.chartBg,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 6,
                  color: colors.text,
                  fontSize: 12
                }}
              >
                <option value="below">{getAlertLabel("below", language)}</option>
                <option value="above">{getAlertLabel("above", language)}</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: 11, color: colors.textSecondary, display: "block", marginBottom: 4 }}>
                {language === "en" ? "Target Price (฿)" : "ราคาเป้าหมาย (฿)"}
              </label>
              <input
                type="number"
                step="0.01"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                placeholder="0.00"
                required
                style={{
                  width: "100%",
                  padding: "6px 8px",
                  background: colors.chartBg,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 6,
                  color: colors.text,
                  fontSize: 12
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                background: colors.accent,
                border: "none",
                borderRadius: 6,
                padding: "8px",
                color: "#000",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600
              }}
            >
              {language === "en" ? "Create Alert" : "สร้างแจ้งเตือน"}
            </button>
          </div>
        </form>
      )}

      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: colors.textSecondary, marginBottom: 6, fontWeight: 600 }}>
            {language === "en" ? "Active Alerts" : "แจ้งเตือนที่ใช้งาน"} ({activeAlerts.length})
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {activeAlerts.map(alert => (
              <div
                key={alert.id}
                style={{
                  background: colors.chartBg,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 6,
                  padding: 10,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 2 }}>
                    {alert.fuelType}
                  </div>
                  <div style={{ fontSize: 11, color: colors.textSecondary }}>
                    {getAlertLabel(alert.condition, language)} ฿{alert.targetPrice}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => onToggleAlert(alert.id)}
                    style={{
                      background: "transparent",
                      border: `1px solid ${colors.border}`,
                      borderRadius: 4,
                      padding: "4px 8px",
                      color: colors.textSecondary,
                      cursor: "pointer",
                      fontSize: 11
                    }}
                    title={language === "en" ? "Pause" : "หยุดชั่วคราว"}
                  >
                    ⏸
                  </button>
                  <button
                    onClick={() => onDeleteAlert(alert.id)}
                    style={{
                      background: "transparent",
                      border: `1px solid ${colors.down}`,
                      borderRadius: 4,
                      padding: "4px 8px",
                      color: colors.down,
                      cursor: "pointer",
                      fontSize: 11
                    }}
                    title={language === "en" ? "Delete" : "ลบ"}
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Triggered Alerts */}
      {triggeredAlerts.length > 0 && (
        <div>
          <div style={{ fontSize: 11, color: colors.textSecondary, marginBottom: 6, fontWeight: 600 }}>
            {language === "en" ? "Triggered Alerts" : "แจ้งเตือนที่ทำงานแล้ว"} ({triggeredAlerts.length})
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {triggeredAlerts.slice(0, 3).map(alert => (
              <div
                key={alert.id}
                style={{
                  background: `${colors.up}11`,
                  border: `1px solid ${colors.up}44`,
                  borderRadius: 6,
                  padding: 10,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  opacity: 0.7
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 2 }}>
                    ✓ {alert.fuelType}
                  </div>
                  <div style={{ fontSize: 11, color: colors.textSecondary }}>
                    {getAlertLabel(alert.condition, language)} ฿{alert.targetPrice}
                  </div>
                </div>
                <button
                  onClick={() => onDeleteAlert(alert.id)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: colors.textSecondary,
                    cursor: "pointer",
                    fontSize: 11
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {alerts.length === 0 && (
        <div style={{
          textAlign: "center",
          padding: 20,
          color: colors.textSecondary,
          fontSize: 12
        }}>
          {language === "en" 
            ? "No alerts yet. Create one to get notified!" 
            : "ยังไม่มีการแจ้งเตือน สร้างเพื่อรับการแจ้งเตือน!"}
        </div>
      )}
    </div>
  );
}
