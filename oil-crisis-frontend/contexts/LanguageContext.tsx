"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "th";

interface Translations {
  header: {
    title: string;
    subtitle: string;
  };
  buttons: {
    exportCSV: string;
    latest: string;
    theme: string;
  };
  chart: {
    title: string;
    dataPoints: string;
    fuels: string;
    diesel: string;
    gasohol95: string;
    actual: string;
    forecast: string;
  };
  panels: {
    latestPrices: string;
    globalOil: string;
    alerts: string;
    alertSpike: string;
    alertStable: string;
    dataExport: string;
    fuelFilter: string;
  };
  export: {
    historical: string;
    historicalDesc: string;
    latestPrices: string;
    latestDesc: string;
    tip: string;
  };
  filter: {
    selected: string;
    of: string;
  };
  table: {
    allFuelPrices: string;
    fuel: string;
    price: string;
  };
}

const translations: Record<Language, Translations> = {
  en: {
    header: {
      title: "🛢️ Oil Crisis Intelligence Terminal",
      subtitle: "LIVE MARKET • THAILAND"
    },
    buttons: {
      exportCSV: "📊 Export CSV",
      latest: "💾 Latest",
      theme: "Theme"
    },
    chart: {
      title: "Oil Price Trend + Forecast",
      dataPoints: "data points",
      fuels: "fuel",
      diesel: "Diesel",
      gasohol95: "Gasohol 95",
      actual: "Actual",
      forecast: "Forecast"
    },
    panels: {
      latestPrices: "Latest Prices",
      globalOil: "Global Oil",
      alerts: "Alerts",
      alertSpike: "🚨 Diesel price spike detected!",
      alertStable: "✅ Market stable",
      dataExport: "📥 Data Export",
      fuelFilter: "🔍 Fuel Filter"
    },
    export: {
      historical: "📊 Historical Data",
      historicalDesc: "Export all {count} records with predictions",
      latestPrices: "💾 Latest Prices",
      latestDesc: "Export current {count} fuel prices",
      tip: "💡 CSV files include timestamps and are ready for Excel/Google Sheets"
    },
    filter: {
      selected: "selected",
      of: "of"
    },
    table: {
      allFuelPrices: "All Fuel Prices",
      fuel: "Fuel",
      price: "Price"
    }
  },
  th: {
    header: {
      title: "🛢️ ระบบเฝ้าระวังวิกฤตน้ำมัน",
      subtitle: "ตลาดสด • ประเทศไทย"
    },
    buttons: {
      exportCSV: "📊 ส่งออก CSV",
      latest: "💾 ล่าสุด",
      theme: "ธีม"
    },
    chart: {
      title: "แนวโน้มราคาน้ำมัน + พยากรณ์",
      dataPoints: "จุดข้อมูล",
      fuels: "ชนิด",
      diesel: "ดีเซล",
      gasohol95: "แก๊สโซฮอล์ 95",
      actual: "จริง",
      forecast: "พยากรณ์"
    },
    panels: {
      latestPrices: "ราคาล่าสุด",
      globalOil: "น้ำมันโลก",
      alerts: "การแจ้งเตือน",
      alertSpike: "🚨 ตรวจพบราคาดีเซลพุ่งสูง!",
      alertStable: "✅ ตลาดมีเสถียรภาพ",
      dataExport: "📥 ส่งออกข้อมูล",
      fuelFilter: "🔍 กรองน้ำมัน"
    },
    export: {
      historical: "📊 ข้อมูลย้อนหลัง",
      historicalDesc: "ส่งออกข้อมูลทั้งหมด {count} รายการพร้อมการพยากรณ์",
      latestPrices: "💾 ราคาล่าสุด",
      latestDesc: "ส่งออกราคาน้ำมัน {count} ชนิดปัจจุบัน",
      tip: "💡 ไฟล์ CSV มีการประทับเวลาและพร้อมใช้กับ Excel/Google Sheets"
    },
    filter: {
      selected: "เลือกแล้ว",
      of: "จาก"
    },
    table: {
      allFuelPrices: "ราคาน้ำมันทั้งหมด",
      fuel: "ชนิดน้ำมัน",
      price: "ราคา"
    }
  }
};

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("oil-language") as Language;
    if (saved) setLanguage(saved);
  }, []);

  const toggleLanguage = () => {
    const newLang = language === "en" ? "th" : "en";
    setLanguage(newLang);
    localStorage.setItem("oil-language", newLang);
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
