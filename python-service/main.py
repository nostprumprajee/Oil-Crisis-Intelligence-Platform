from fastapi import FastAPI
import requests
import xml.etree.ElementTree as ET
import html
from datetime import datetime, timedelta
from fastapi.middleware.cors import CORSMiddleware
from sklearn.linear_model import LinearRegression
import numpy as np

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # dev mode
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def fetch_oil(day: datetime):
    url = "https://orapiweb.pttor.com/oilservice/OilPrice.asmx"

    headers = {
        "Content-Type": "application/soap+xml; charset=utf-8"
    }

    body = f"""<?xml version="1.0" encoding="utf-8"?>
    <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                     xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                     xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
      <soap12:Body>
        <GetOilPrice xmlns="http://www.pttor.com">
          <Language>TH</Language>
          <DD>{day.day}</DD>
          <MM>{day.month}</MM>
          <YYYY>{day.year}</YYYY>
        </GetOilPrice>
      </soap12:Body>
    </soap12:Envelope>"""

    try:
        res = requests.post(url, data=body, headers=headers, timeout=10)
    except Exception:
        return []

    if res.status_code != 200:
        return []

    try:
        root = ET.fromstring(res.content)
    except:
        return []

    result = None
    for elem in root.iter():
        if "GetOilPriceResult" in elem.tag:
            result = elem.text
            break

    if not result:
        return []

    inner_xml = html.unescape(result)

    try:
        inner_xml = inner_xml.encode("latin1").decode("utf-8")
    except:
        pass

    try:
        inner_root = ET.fromstring(inner_xml)
    except:
        return []

    prices = []

    for item in inner_root.findall(".//FUEL"):
        fuel = item.findtext("PRODUCT")
        price = item.findtext("PRICE")

        if fuel and price:
            prices.append({
                "fuel": fuel.strip(),
                "price": float(price)
            })

    return prices

@app.get("/thai-oil")
def get_thai_oil():
    return fetch_oil(datetime.now())

@app.get("/thai-oil/history")
def get_history():
    results = []

    for i in range(7):
        day = datetime.now() - timedelta(days=i)

        data = fetch_oil(day)

        results.append({
            "date": day.strftime("%Y-%m-%d"),
            "prices": data
        })

    return results

@app.get("/thai-oil/predict")
def predict_oil():
    history = []

    # ดึงย้อนหลัง 7 วัน
    for i in range(7):
        day = datetime.now() - timedelta(days=i)
        data = fetch_oil(day)

        for item in data:
            if "ดีเซล" in item["fuel"]:
                history.append(item["price"])

    if len(history) < 2:
        return {"error": "Not enough data"}

    # reverse ให้เรียงเวลา
    history = history[::-1]

    # 🔥 สร้าง X,Y
    X = np.array(range(len(history))).reshape(-1, 1)
    y = np.array(history)

    model = LinearRegression()
    model.fit(X, y)

    # 🔮 predict 3 วันข้างหน้า
    future_x = np.array(range(len(history), len(history) + 3)).reshape(-1, 1)
    predictions = model.predict(future_x)

    return {
        "history": history,
        "prediction": predictions.tolist()
    }