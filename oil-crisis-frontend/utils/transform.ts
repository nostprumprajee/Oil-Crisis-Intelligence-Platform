export const transformData = (raw: any[], pred: any) => {
  return raw
    .map((day: any) => {
      const obj: any = {
        date: day.date === "Today"
          ? new Date().toISOString().slice(0, 10) // 🔥 normalize
          : day.date
      };

      day.prices.forEach((p: any) => {
        if (p.fuel.includes("ดีเซล")) {
          obj.Diesel = p.price;
        }

        if (p.fuel.includes("แก๊สโซฮอล์ 95")) {
          obj.Gasohol95 = p.price;
        }
      });

      return obj;
    })
    .filter(d => d.date) // กัน null
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};