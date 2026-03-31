from fastapi import FastAPI
import requests
from bs4 import BeautifulSoup

app = FastAPI()

@app.get("/thai-oil")
def get_thai_oil():
    url = "https://www.pttor.com/th/oil-price"  # ตัวอย่าง

    headers = {
        "User-Agent": "Mozilla/5.0"
    }

    res = requests.get(url, headers=headers)
    soup = BeautifulSoup(res.text, "html.parser")

    # ⚠️ ต้อง inspect HTML จริงอีกที (structure อาจเปลี่ยน)
    prices = []

    rows = soup.select("table tr")

    for r in rows:
        cols = [c.text.strip() for c in r.find_all("td")]
        if len(cols) >= 2:
            prices.append({
                "fuel": cols[0],
                "price": cols[1]
            })

    return prices