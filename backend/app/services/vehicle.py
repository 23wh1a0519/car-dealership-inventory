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
def get_vehicles(db: Session):
    return db.query(Vehicle).all()
def search_vehicles(
    db: Session,
    make: str | None = None,
    model: str | None = None,
    category: str | None = None,
    min_price: float | None = None,
    max_price: float | None = None,
):
    query = db.query(Vehicle)
    if make:
        query = query.filter(Vehicle.make == make)
    if model:
        query = query.filter(Vehicle.model == model)
    if category:
        query = query.filter(Vehicle.category == category)
    if min_price is not None:
        query = query.filter(Vehicle.price >= min_price)
    if max_price is not None:
        query = query.filter(Vehicle.price <= max_price)
    return query.all()