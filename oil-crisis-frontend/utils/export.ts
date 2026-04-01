export function exportToCSV(data: any[], filename: string = "oil-data") {
  if (!data || data.length === 0) {
    alert("No data to export");
    return;
  }

  // Get all unique keys from data
  const headers = Array.from(
    new Set(data.flatMap(item => Object.keys(item)))
  );

  // Create CSV header
  const csvHeader = headers.join(",");

  // Create CSV rows
  const csvRows = data.map(item => {
    return headers.map(header => {
      const value = item[header];
      // Handle undefined/null values
      if (value === undefined || value === null) return "";
      // Escape commas and quotes
      if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(",");
  });

  // Combine header and rows
  const csv = [csvHeader, ...csvRows].join("\n");

  // Create blob and download
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}-${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportLatestPrices(latest: any[]) {
  const formatted = latest.map(item => ({
    Fuel: item.fuel,
    Price: item.price,
    Date: new Date().toISOString()
  }));

  exportToCSV(formatted, "latest-oil-prices");
}

export function exportHistoricalData(data: any[]) {
  // Clean up data for export
  const formatted = data.map(item => {
    const row: any = {
      Date: item.date
    };

    // Add actual prices
    if (item.Diesel !== undefined) row.Diesel_Actual = item.Diesel;
    if (item.Gasohol95 !== undefined) row.Gasohol95_Actual = item.Gasohol95;

    // Add predictions
    if (item.Diesel_pred !== undefined) row.Diesel_Forecast = item.Diesel_pred;
    if (item.Gasohol95_pred !== undefined) row.Gasohol95_Forecast = item.Gasohol95_pred;

    // Add confidence intervals
    if (item.Diesel_low !== undefined) row.Diesel_Low = item.Diesel_low;
    if (item.Diesel_high !== undefined) row.Diesel_High = item.Diesel_high;
    if (item.Gasohol95_low !== undefined) row.Gasohol95_Low = item.Gasohol95_low;
    if (item.Gasohol95_high !== undefined) row.Gasohol95_High = item.Gasohol95_high;

    return row;
  });

  exportToCSV(formatted, "oil-historical-data");
}
