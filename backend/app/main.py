from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base,engine
from app.routers.auth import router as auth_router
from app.routers.vehicles import router as vehicle_router
from app.models.user import User

Base.metadata.create_all(bind=engine)
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(vehicle_router)
@app.get("/")
def root():
    return {"message": "Car Dealership API"}