export const transformData = (raw: any[]) => {
  return raw.map((day) => {
    const obj: any = {
      date: day.date
    };

    day.prices.forEach((p: any) => {
      if (p.fuel.includes("ดีเซล")) {
        obj.Diesel = p.price;
      }
      if (p.fuel.includes("95")) {
        obj.Gasohol95 = p.price;
      }
    });

    return obj;
  });
};