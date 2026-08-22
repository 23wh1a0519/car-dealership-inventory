from fastapi.testclient import TestClient
from app.main import app
client = TestClient(app)
def test_register_user():
    response = client.post("/api/auth/register",json = {"email": "test@example.com","password": "Password123",},)
    assert response.status_code == 201