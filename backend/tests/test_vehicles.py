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