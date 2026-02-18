def test_register_success(client):
    resp = client.post(
        "/api/register",
        json={"userId": "alice", "password": "password123"},
    )
    assert resp.status_code == 201
    data = resp.get_json()
    assert data["userId"] == "alice"
    assert "token" in data


def test_register_duplicate(client):
    client.post("/api/register", json={"userId": "alice", "password": "pass1"})
    resp = client.post("/api/register", json={"userId": "alice", "password": "pass2"})
    assert resp.status_code == 409


def test_register_missing_fields(client):
    resp = client.post("/api/register", json={"userId": ""})
    assert resp.status_code == 400


def test_login_success(client):
    client.post("/api/register", json={"userId": "bob", "password": "secret"})
    resp = client.post("/api/login", json={"userId": "bob", "password": "secret"})
    assert resp.status_code == 200
    assert "token" in resp.get_json()


def test_login_wrong_password(client):
    client.post("/api/register", json={"userId": "bob", "password": "secret"})
    resp = client.post("/api/login", json={"userId": "bob", "password": "wrong"})
    assert resp.status_code == 401


def test_login_nonexistent_user(client):
    resp = client.post("/api/login", json={"userId": "ghost", "password": "pass"})
    assert resp.status_code == 401
