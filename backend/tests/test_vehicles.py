from uuid import uuid4
from fastapi.testclient import TestClient
from app.main import app
from app.routers.auth import get_db
from app.models.user import User

client = TestClient(app)
def unique_email(prefix="registertest2026"):
    return f"{prefix}_{uuid4().hex[:8]}@example.com"

def create_user(email=None, is_admin=False):
    if email is None:
        email = unique_email("admin" if is_admin else "user")
    db = next(get_db())
    try:
        user = User(
            email=email,
            password="Password123",
            is_admin=is_admin,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return email
    finally:
        db.close()

def login(email):
    response = client.post(
        "/api/auth/login",
        json={
            "email": email,
            "password": "Password123",
        },
    )
    assert response.status_code == 200

    return response.json()["access_token"]

def create_admin_and_login():
    email = create_user(is_admin=True)
    return login(email)

def create_normal_user_and_login():
    email = create_user(is_admin=False)
    return login(email)

def create_vehicle(token, make="Toyota", model="Camry"):
    response = client.post(
        "/api/vehicles",
        json={
            "make": make,
            "model": model,
            "category": "Sedan",
            "price": 25000,
            "quantity": 5,
        },
        headers={
            "Authorization": f"Bearer {token}",
        },
    )
    assert response.status_code == 201
    return response.json()

def test_create_vehicle():
    token = create_admin_and_login()
    response = client.post(
        "/api/vehicles",
        json={
            "make": "Toyota",
            "model": "Camry",
            "category": "Sedan",
            "price": 25000,
            "quantity": 5,
        },
        headers={
            "Authorization": f"Bearer {token}",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["make"] == "Toyota"
    assert data["model"] == "Camry"
    assert data["category"] == "Sedan"
    assert data["price"] == 25000
    assert data["quantity"] == 5
    assert "id" in data

def test_create_vehicle_requires_admin():
    token = create_normal_user_and_login()
    response = client.post(
        "/api/vehicles",
        json={
            "make": "Honda",
            "model": "Civic",
            "category": "Sedan",
            "price": 22000,
            "quantity": 3,
        },
        headers={
            "Authorization": f"Bearer {token}",
        },
    )
    assert response.status_code == 403
    assert response.json()["detail"] == "Admin access required"

def test_get_vehicles():
    token = create_normal_user_and_login()
    response = client.get(
        "/api/vehicles",
        headers={
            "Authorization": f"Bearer {token}",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

def test_search_vehicles_by_make():
    admin_token = create_admin_and_login()
    create_vehicle(
        admin_token,
        make="Toyota",
        model="Camry",
    )
    token = create_normal_user_and_login()
    response = client.get(
        "/api/vehicles/search",
        params={
            "make": "Toyota",
        },
        headers={
            "Authorization": f"Bearer {token}",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    for vehicle in data:
        assert vehicle["make"] == "Toyota"
        
def test_search_vehicles_by_model():
    admin_token = create_admin_and_login()
    create_vehicle(
        admin_token,
        make="Toyota",
        model="Camry",
    )
    token = create_normal_user_and_login()
    response = client.get(
        "/api/vehicles/search",
        params={
            "model": "Camry",
        },
        headers={
            "Authorization": f"Bearer {token}",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    for vehicle in data:
        assert vehicle["model"] == "Camry"

def test_search_vehicles_by_category():
    admin_token = create_admin_and_login()
    response_create = client.post(
        "/api/vehicles",
        json={
            "make": "BMW",
            "model": "X5",
            "category": "SUV",
            "price": 60000,
            "quantity": 2,
        },
        headers={
            "Authorization": f"Bearer {admin_token}",
        },
    )
    assert response_create.status_code == 201
    token = create_normal_user_and_login()
    response = client.get(
        "/api/vehicles/search",
        params={
            "category": "SUV",
        },
        headers={
            "Authorization": f"Bearer {token}",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    for vehicle in data:
        assert vehicle["category"] == "SUV"

def test_search_vehicles_by_price_range():
    admin_token = create_admin_and_login()
    response_create = client.post(
        "/api/vehicles",
        json={
            "make": "Ford",
            "model": "Mustang",
            "category": "Sports",
            "price": 45000,
            "quantity": 2,
        },
        headers={
            "Authorization": f"Bearer {admin_token}",
        },
    )
    assert response_create.status_code == 201
    token = create_normal_user_and_login()
    response = client.get(
        "/api/vehicles/search",
        params={
            "min_price": 40000,
            "max_price": 50000,
        },
        headers={
            "Authorization": f"Bearer {token}",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    for vehicle in data:
        assert 40000 <= vehicle["price"] <= 50000

def test_update_vehicle():
    token = create_admin_and_login()
    vehicle = create_vehicle(
        token,
        make="Toyota",
        model="Corolla",
    )
    vehicle_id = vehicle["id"]
    response = client.put(
        f"/api/vehicles/{vehicle_id}",
        json={
            "make": "Toyota",
            "model": "Camry",
            "category": "Sedan",
            "price": 25000,
            "quantity": 3,
        },
        headers={
            "Authorization": f"Bearer {token}",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == vehicle_id
    assert data["make"] == "Toyota"
    assert data["model"] == "Camry"
    assert data["category"] == "Sedan"
    assert data["price"] == 25000
    assert data["quantity"] == 3

def test_update_vehicle_requires_admin():
    admin_token = create_admin_and_login()
    vehicle = create_vehicle(
        admin_token,
        make="Honda",
        model="City",
    )
    normal_token = create_normal_user_and_login()
    response = client.put(
        f"/api/vehicles/{vehicle['id']}",
        json={
            "make": "Honda",
            "model": "Civic",
            "category": "Sedan",
            "price": 22000,
            "quantity": 2,
        },
        headers={
            "Authorization": f"Bearer {normal_token}",
        },
    )
    assert response.status_code == 403

def test_delete_vehicle_requires_admin():
    admin_token = create_admin_and_login()
    vehicle = create_vehicle(
        admin_token,
        make="Audi",
        model="A4",
    )
    normal_token = create_normal_user_and_login()
    response = client.delete(
        f"/api/vehicles/{vehicle['id']}",
        headers={
            "Authorization": f"Bearer {normal_token}",
        },
    )
    assert response.status_code == 403
    assert response.json()["detail"] == "Admin access required"

def test_admin_can_delete_vehicle():
    token = create_admin_and_login()
    vehicle = create_vehicle(
        token,
        make="BMW",
        model="X3",
    )
    response = client.delete(
        f"/api/vehicles/{vehicle['id']}",
        headers={
            "Authorization": f"Bearer {token}",
        },
    )
    assert response.status_code == 204

def test_purchase_vehicle():
    admin_token = create_admin_and_login()
    vehicle = create_vehicle(
        admin_token,
        make="Toyota",
        model="Fortuner",
    )
    vehicle_id = vehicle["id"]
    user_token = create_normal_user_and_login()
    response = client.post(
        f"/api/vehicles/{vehicle_id}/purchase",
        headers={
            "Authorization": f"Bearer {user_token}",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == vehicle_id
    assert data["quantity"] == 4

def test_purchase_vehicle_out_of_stock():
    admin_token = create_admin_and_login()
    response_create = client.post(
        "/api/vehicles",
        json={
            "make": "Honda",
            "model": "City",
            "category": "Sedan",
            "price": 20000,
            "quantity": 0,
        },
        headers={
            "Authorization": f"Bearer {admin_token}",
        },
    )
    assert response_create.status_code == 201
    vehicle_id = response_create.json()["id"]
    user_token = create_normal_user_and_login()
    response = client.post(
        f"/api/vehicles/{vehicle_id}/purchase",
        headers={
            "Authorization": f"Bearer {user_token}",
        },
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Vehicle is out of stock"

def test_restock_vehicle_requires_admin():
    admin_token = create_admin_and_login()
    vehicle = create_vehicle(
        admin_token,
        make="Toyota",
        model="RAV4",
    )
    normal_token = create_normal_user_and_login()
    response = client.post(
        f"/api/vehicles/{vehicle['id']}/restock",
        json={
            "quantity": 5,
        },
        headers={
            "Authorization": f"Bearer {normal_token}",
        },
    )
    assert response.status_code == 403
    assert response.json()["detail"] == "Admin access required"

def test_admin_can_restock_vehicle():
    token = create_admin_and_login()
    vehicle = create_vehicle(
        token,
        make="Toyota",
        model="RAV4",
    )
    vehicle_id = vehicle["id"]
    response = client.post(
        f"/api/vehicles/{vehicle_id}/restock",
        json={
            "quantity": 5,
        },
        headers={
            "Authorization": f"Bearer {token}",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == vehicle_id
    assert data["quantity"] == 10