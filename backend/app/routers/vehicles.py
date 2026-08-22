from fastapi import APIRouter,Depends
from app.dependencies.auth import get_current_user
router = APIRouter(
    prefix="/api/vehicles",
    tags=["Vehicles"],
)
@router.post("")
def create_vehicle(
    current_user=Depends(get_current_user),
):
    return {"message": "Vehicle creation authorized"}