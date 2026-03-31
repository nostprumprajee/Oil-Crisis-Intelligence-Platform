from fastapi import FastAPI
import requests
import xml.etree.ElementTree as ET
from datetime import datetime
import html

app = FastAPI()

@app.get("/thai-oil")
def get_thai_oil():
    url = "https://orapiweb.pttor.com/oilservice/OilPrice.asmx"

    today = datetime.now()

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
          <DD>{today.day}</DD>
          <MM>{today.month}</MM>
          <YYYY>{today.year}</YYYY>
        </GetOilPrice>
      </soap12:Body>
    </soap12:Envelope>"""

    try:
        res = requests.post(url, data=body, headers=headers, timeout=10)
    except Exception as e:
        return {"error": f"Request failed: {str(e)}"}

    if res.status_code != 200:
        return {"error": res.text}

    try:
        root = ET.fromstring(res.content)
    except Exception as e:
        return {"error": "SOAP parse failed", "raw": res.text[:500]}

    # หา result
    result = None
    for elem in root.iter():
        if "GetOilPriceResult" in elem.tag:
            result = elem.text
            break

    if not result:
        return {"error": "No result"}

    inner_xml = html.unescape(result)

    # 🔥 FIX encoding (safe)
    try:
        inner_xml = inner_xml.encode("latin1").decode("utf-8")
    except:
        pass

    try:
        inner_root = ET.fromstring(inner_xml)
    except Exception as e:
        return {"error": "Inner XML parse failed", "raw": inner_xml[:500]}

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