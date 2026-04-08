import pytest
from pymongo import MongoClient
import mongomock

from app import create_app


@pytest.fixture()
def app(monkeypatch):
    """Create a test app backed by a temporary MongoDB database."""
    test_config = {
        "TESTING": True,
        "MONGODB_URI": "mongodb://localhost:27017",
        "DB_NAME": "haas_test_db",
    }
    import app as my_app
    monkeypatch.setattr(my_app, "MongoClient", mongomock.MongoClient)
    
    application = create_app(test_config)

    yield application

    mock_client = mongomock.MongoClient(test_config["MONGODB_URI"])
    mock_client.drop_database(test_config["DB_NAME"])


@pytest.fixture()
def client(app):
    return app.test_client()


@pytest.fixture()
def auth_header(client):
    """Register a test user and return an Authorization header."""
    resp = client.post(
        "/api/register",
        json={"userId": "testuser", "password": "testpass123"},
    )
    token = resp.get_json()["token"]
    return {"Authorization": f"Bearer {token}"}
