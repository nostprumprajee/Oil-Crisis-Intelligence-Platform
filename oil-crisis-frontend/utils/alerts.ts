export interface PriceAlert {
  id: string;
  fuelType: string;
  targetPrice: number;
  condition: "above" | "below";
  isActive: boolean;
  createdAt: string;
  triggeredAt?: string;
}

const STORAGE_KEY = "oil-price-alerts";

export function saveAlerts(alerts: PriceAlert[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
  }
}

export function loadAlerts(): PriceAlert[] {
  if (typeof window === "undefined") return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function createAlert(
  fuelType: string,
  targetPrice: number,
  condition: "above" | "below"
): PriceAlert {
  return {
    id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    fuelType,
    targetPrice,
    condition,
    isActive: true,
    createdAt: new Date().toISOString()
  };
}

export function checkAlerts(
  alerts: PriceAlert[],
  currentPrices: { fuel: string; price: number }[]
): { triggeredAlerts: PriceAlert[]; updatedAlerts: PriceAlert[] } {
  const triggeredAlerts: PriceAlert[] = [];
  const updatedAlerts = alerts.map(alert => {
    if (!alert.isActive) return alert;

    const priceData = currentPrices.find(p => 
      p.fuel.includes(alert.fuelType) || alert.fuelType.includes(p.fuel)
    );

    if (!priceData) return alert;

    const shouldTrigger = 
      (alert.condition === "above" && priceData.price >= alert.targetPrice) ||
      (alert.condition === "below" && priceData.price <= alert.targetPrice);

    if (shouldTrigger) {
      triggeredAlerts.push(alert);
      return {
        ...alert,
        isActive: false,
        triggeredAt: new Date().toISOString()
      };
    }

    return alert;
  });

  return { triggeredAlerts, updatedAlerts };
}

export function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return Promise.resolve("denied");
  }

  if (Notification.permission === "granted") {
    return Promise.resolve("granted");
  }

  if (Notification.permission !== "denied") {
    return Notification.requestPermission();
  }

  return Promise.resolve("denied");
}

export function showNotification(alert: PriceAlert, currentPrice: number): void {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  
  if (Notification.permission === "granted") {
    const title = "🔔 Oil Price Alert!";
    const body = `${alert.fuelType} is now ${alert.condition} ฿${alert.targetPrice}\nCurrent price: ฿${currentPrice}`;
    
    new Notification(title, {
      body,
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      tag: alert.id
    });
  }
}

export function getAlertLabel(
  condition: "above" | "below",
  language: "en" | "th"
): string {
  const labels = {
    en: {
      above: "Above",
      below: "Below"
    },
    th: {
      above: "สูงกว่า",
      below: "ต่ำกว่า"
    }
  };

  return labels[language][condition];
}
