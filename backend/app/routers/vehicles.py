from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_user
from app.routers.auth import get_db

from app.schemas.vehicle import (
    VehicleCreate,
    VehicleResponse,
    RestockRequest,
)

from app.services.vehicle import (
    create_vehicle as create_vehicle_service,
    get_vehicles as get_vehicles_service,
    search_vehicles as search_vehicles_service,
    update_vehicle as update_vehicle_service,
    delete_vehicle as delete_vehicle_service,
    purchase_vehicle as purchase_vehicle_service,
    restock_vehicle as restock_vehicle_service,
)

router = APIRouter(
    prefix="/api/vehicles",
    tags=["Vehicles"],
)


# =========================
# CREATE VEHICLE - ADMIN ONLY
# =========================

@router.post(
    "",
    response_model=VehicleResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_vehicle(
    vehicle_data: VehicleCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if not current_user["is_admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )

    return create_vehicle_service(db, vehicle_data)


# =========================
# GET VEHICLES
# =========================

@router.get(
    "",
    response_model=list[VehicleResponse],
)
def get_vehicles(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return get_vehicles_service(db)


# =========================
# SEARCH VEHICLES
# =========================

@router.get(
    "/search",
    response_model=list[VehicleResponse],
)
def search_vehicles(
    make: str | None = None,
    model: str | None = None,
    category: str | None = None,
    min_price: float | None = None,
    max_price: float | None = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return search_vehicles_service(
        db,
        make,
        model,
        category,
        min_price,
        max_price,
    )


# =========================
# UPDATE VEHICLE - ADMIN ONLY
# =========================

@router.put(
    "/{vehicle_id}",
    response_model=VehicleResponse,
)
def update_vehicle(
    vehicle_id: int,
    vehicle_data: VehicleCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if not current_user["is_admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )

    vehicle = update_vehicle_service(
        db,
        vehicle_id,
        vehicle_data,
    )

    if vehicle is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found",
        )

    return vehicle


# =========================
# DELETE VEHICLE - ADMIN ONLY
# =========================

@router.delete(
    "/{vehicle_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if not current_user["is_admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )

    vehicle = delete_vehicle_service(
        db,
        vehicle_id,
    )

    if vehicle is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found",
        )


# =========================
# PURCHASE VEHICLE
# =========================

@router.post(
    "/{vehicle_id}/purchase",
    response_model=VehicleResponse,
)
def purchase_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    vehicle = purchase_vehicle_service(
        db,
        vehicle_id,
    )

    if vehicle is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found",
        )

    if vehicle == "out_of_stock":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vehicle is out of stock",
        )

    return vehicle


# =========================
# RESTOCK VEHICLE - ADMIN ONLY
# =========================

@router.post(
    "/{vehicle_id}/restock",
    response_model=VehicleResponse,
)
def restock_vehicle(
    vehicle_id: int,
    restock_data: RestockRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if not current_user["is_admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )

    vehicle = restock_vehicle_service(
        db,
        vehicle_id,
        restock_data.quantity,
    )

    if vehicle is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found",
        )

    return vehicle