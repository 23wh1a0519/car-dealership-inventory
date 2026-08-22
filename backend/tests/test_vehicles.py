from fastapi.testclient import TestClient
from app.main import app
client = TestClient(app)
def test_create_vehicle():
    login_response = client.post("/api/auth/login",
        json={
            "email": "newuser@example.com",
            "password": "Password123",
        },
    )
    token = login_response.json()["access_token"]
    response = client.post(
        "/api/vehicles",
        json={
            "make": "Toyota",
            "model": "Camry",
            "category": "Sedan",
            "price": 25000,
            "quantity": 5,
        },headers={
            "Authorization": f"Bearer {token}",
        },)
    assert response.status_code == 201

    data = response.json()

    assert data["make"] == "Toyota"
    assert data["model"] == "Camry"
    assert data["category"] == "Sedan"
    assert data["price"] == 25000
    assert data["quantity"] == 5
def test_get_vehicles():
    login_response = client.post(
        "/api/auth/login",
        json={
            "email": "newuser@example.com",
            "password": "Password123",
        },
    )
    token = login_response.json()["access_token"]
    response = client.get(
        "/api/vehicles",
        headers={
            "Authorization": f"Bearer {token}",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
def test_search_vehicles_by_make():
    login_response = client.post(
        "/api/auth/login",
        json={
            "email": "newuser@example.com",
            "password": "Password123",
        },
    )
    token = login_response.json()["access_token"]
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
    assert data[0]["make"] == "Toyota"

def test_search_vehicles_by_model():
    login_response = client.post(
        "/api/auth/login",
        json={
            "email": "newuser@example.com",
            "password": "Password123",
        },
    )
    token = login_response.json()["access_token"]
    client.post(
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
    login_response = client.post(
        "/api/auth/login",
        json={
            "email": "newuser@example.com",
            "password": "Password123",
        },
    )
    token = login_response.json()["access_token"]
    client.post(
        "/api/vehicles",
        json={
            "make": "BMW",
            "model": "X5",
            "category": "SUV",
            "price": 60000,
            "quantity": 2,
        },
        headers={
            "Authorization": f"Bearer {token}",
        },
    )
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
    login_response = client.post(
        "/api/auth/login",
        json={
            "email": "newuser@example.com",
            "password": "Password123",
        },
    )
    token = login_response.json()["access_token"]
    client.post(
        "/api/vehicles",
        json={
            "make": "Ford",
            "model": "Mustang",
            "category": "Sports",
            "price": 45000,
            "quantity": 2,
        },
        headers={
            "Authorization": f"Bearer {token}",
        },
    )
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
    login_response = client.post(
        "/api/auth/login",
        json={
            "email": "newuser@example.com",
            "password": "Password123",
        },
    )
    token = login_response.json()["access_token"]
    create_response = client.post(
        "/api/vehicles",
        json={
            "make": "Toyota",
            "model": "Corolla",
            "category": "Sedan",
            "price": 20000,
            "quantity": 5,
        },
        headers={
            "Authorization": f"Bearer {token}",
        },
    )
    vehicle_id = create_response.json()["id"]
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

def test_delete_vehicle_requires_admin():
    login_response = client.post(
        "/api/auth/login",
        json={
            "email": "newuser@example.com",
            "password": "Password123",
        },
    )
    token = login_response.json()["access_token"]
    create_response = client.post(
        "/api/vehicles",
        json={
            "make": "Audi",
            "model": "A4",
            "category": "Sedan",
            "price": 40000,
            "quantity": 2,
        },
        headers={
            "Authorization": f"Bearer {token}",
        },
    )
    vehicle_id = create_response.json()["id"]
    response = client.delete(
        f"/api/vehicles/{vehicle_id}",
        headers={
            "Authorization": f"Bearer {token}",
        },
    )
    assert response.status_code == 403