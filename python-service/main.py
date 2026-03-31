from fastapi import FastAPI

app = FastAPI()

@app.get("/simulate")
def simulate(disruption: int = 10):
    base_price = 110
    
    # simple model
    predicted_price = base_price + (disruption * 2)

    return {
        "disruption": disruption,
        "predicted_price": predicted_price
    }