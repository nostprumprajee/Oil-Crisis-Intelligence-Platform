export const transformData = (raw: any[]) => {
  return raw.map((day) => {
    const obj: any = {
      date: day.date
    };

    day.prices.forEach((p: any) => {
      const fuel = p.fuel;

      if (fuel.includes("ดีเซล")) {
        obj.Diesel = p.price;
      }

      if (fuel.includes("เบนซินแก๊สโซฮอล์ 95")) {
        obj.Gasohol95 = p.price;
      }
    });

    return obj;
  });
};