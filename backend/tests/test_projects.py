def test_create_project(client, auth_header):
    resp = client.post(
        "/api/projects",
        json={
            "projectId": "proj1",
            "name": "Test Project",
            "description": "A test project",
        },
        headers=auth_header,
    )
    assert resp.status_code == 201
    data = resp.get_json()
    assert data["projectId"] == "proj1"
    assert "testuser" in data["members"]


def test_create_duplicate_project(client, auth_header):
    client.post(
        "/api/projects",
        json={"projectId": "proj1", "name": "P1", "description": ""},
        headers=auth_header,
    )
    resp = client.post(
        "/api/projects",
        json={"projectId": "proj1", "name": "P1 again", "description": ""},
        headers=auth_header,
    )
    assert resp.status_code == 409


def test_list_projects(client, auth_header):
    client.post(
        "/api/projects",
        json={"projectId": "p1", "name": "P1", "description": ""},
        headers=auth_header,
    )
    client.post(
        "/api/projects",
        json={"projectId": "p2", "name": "P2", "description": ""},
        headers=auth_header,
    )
    resp = client.get("/api/projects", headers=auth_header)
    assert resp.status_code == 200
    assert len(resp.get_json()) == 2


def test_join_project(client, auth_header):
    client.post(
        "/api/projects",
        json={"projectId": "shared", "name": "Shared", "description": ""},
        headers=auth_header,
    )

    reg = client.post(
        "/api/register",
        json={"userId": "user2", "password": "pass2"},
    )
    token2 = reg.get_json()["token"]
    header2 = {"Authorization": f"Bearer {token2}"}

    resp = client.post("/api/projects/shared/join", headers=header2)
    assert resp.status_code == 200
    assert "user2" in resp.get_json()["members"]


def test_unauthenticated_access(client):
    resp = client.get("/api/projects")
    assert resp.status_code == 401
