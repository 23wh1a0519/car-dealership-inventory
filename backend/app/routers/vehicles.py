from fastapi import APIRouter,Depends,status
from sqlalchemy.orm import Session
from app.dependencies.auth import get_current_user
from app.routers.auth import get_db
from app.schemas.vehicle import VehicleCreate,VehicleResponse
from app.services.vehicle import create_vehicle as create_vehicle_service
from app.services.vehicle import (
    create_vehicle as create_vehicle_service,
    get_vehicles as get_vehicles_service,
    search_vehicles as search_vehicles_service,
)
router = APIRouter(
    prefix="/api/vehicles",
    tags=["Vehicles"],
)
@router.post("",response_model=VehicleResponse,status_code=status.HTTP_201_CREATED,)
def create_vehicle(
    vehicle_data: VehicleCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return create_vehicle_service(db, vehicle_data)
@router.get(
    "",
    response_model=list[VehicleResponse],
)
def get_vehicles(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return get_vehicles_service(db)
@router.get(
    "/search",
    response_model=list[VehicleResponse],
)
def search_vehicles(
    make: str | None = None,
    model: str | None = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return search_vehicles_service(db,make,model)