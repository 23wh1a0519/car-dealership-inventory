from fastapi.testclient import TestClient
from app.main import app
client = TestClient(app)
def test_register_user():
    response = client.post("/api/auth/register",json = {"email": "newuser@example.com","password": "Password123",},)
    assert response.status_code == 201
def test_login_user():
    response = client.post(
        "/api/auth/login",
        json={
            "email": "newuser@example.com",
            "password": "Password123",
        },
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
    token = response.json()["access_token"]
    assert len(token.split(".")) == 3