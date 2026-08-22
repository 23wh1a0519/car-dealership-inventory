from fastapi.testclient import TestClient
from app.main import app
client = TestClient(app)
def test_create_vehicle_requires_authentication():
    response = client.post(
        "/api/vehicles",
        json={
            "make": "Toyota",
            "model": "Camry",
            "category": "Sedan",
            "price": 25000,
            "quantity": 5,
        },)
    assert response.status_code == 401