from sqlalchemy.orm import Session
from app.models.vehicle import Vehicle
from app.schemas.vehicle import VehicleCreate
def create_vehicle(db: Session, vehicle_data: VehicleCreate):
    vehicle = Vehicle(
        make=vehicle_data.make,
        model=vehicle_data.model,
        category=vehicle_data.category,
        price=vehicle_data.price,
        quantity=vehicle_data.quantity,
    )
    db.add(vehicle)
    db.commit()
    db.refresh(vehicle)
    return vehicle