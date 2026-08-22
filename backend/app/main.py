from fastapi import FastAPI
from app.database import Base,engine
from app.routers.auth import router as auth_router
from app.models.user import User

Base.metadata.create_all(bind=engine)
app = FastAPI()
app.include_router(auth_router)
@app.get("/")
def root():
    return {"message": "Car Dealership API"}