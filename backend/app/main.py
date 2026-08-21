from fastapi import FastAPI
app = FastAPI(title="Car Dealership Inventory API")
@app.get("/")
def root():
    return {"message": "Car Dealership Inventory API"}