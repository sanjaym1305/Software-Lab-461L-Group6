import pytest
import mongomock

from app import create_app


@pytest.fixture()
def app():
    """Create a test app backed by an in-memory MongoDB database."""
    test_config = {
        "TESTING": True,
        "DB_NAME": "haas_test_db",
    }
    application = create_app(test_config)
    
    yield application

    application.config["db"].client.drop_database(test_config["DB_NAME"])


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
