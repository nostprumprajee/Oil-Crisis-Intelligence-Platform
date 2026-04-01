export const transformData = (raw: any[], prediction: any) => {
  const data = raw.map((day) => {
    const obj: any = {
      date: day.date
    };

    day.prices.forEach((p: any) => {
      if (p.fuel.includes("ดีเซล")) {
        obj.Diesel = p.price;
      }

      if (p.fuel.includes("เบนซินแก๊สโซฮอล์ 95")) {
        obj.Gasohol95 = p.price;
      }
    });

    return obj;
  });

  const sorted = [...data].reverse();

  // 🔮 append prediction
  prediction?.diesel?.pred?.forEach((_: any, i: number) => {
    sorted.push({
      date: `+${i + 1}d`,

      Diesel_pred: prediction.diesel.pred[i],
      Diesel_low: prediction.diesel.low[i],
      Diesel_high: prediction.diesel.high[i],

      Gasohol95_pred: prediction.gasohol95.pred[i],
      Gasohol95_low: prediction.gasohol95.low[i],
      Gasohol95_high: prediction.gasohol95.high[i]
    });
  });

  return sorted;
};