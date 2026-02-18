def test_get_hardware(client, auth_header):
    resp = client.get("/api/hardware", headers=auth_header)
    assert resp.status_code == 200
    hw_sets = resp.get_json()
    assert len(hw_sets) == 2
    names = {h["name"] for h in hw_sets}
    assert names == {"HWSet1", "HWSet2"}
    for h in hw_sets:
        assert h["capacity"] == 100
        assert h["availability"] == 100


def test_checkout_success(client, auth_header):
    client.post(
        "/api/projects",
        json={"projectId": "p1", "name": "P1", "description": ""},
        headers=auth_header,
    )
    resp = client.post(
        "/api/hardware/checkout",
        json={"projectId": "p1", "hwSet": "HWSet1", "quantity": 10},
        headers=auth_header,
    )
    assert resp.status_code == 200
    assert resp.get_json()["availability"] == 90


def test_checkout_over_capacity(client, auth_header):
    client.post(
        "/api/projects",
        json={"projectId": "p1", "name": "P1", "description": ""},
        headers=auth_header,
    )
    resp = client.post(
        "/api/hardware/checkout",
        json={"projectId": "p1", "hwSet": "HWSet1", "quantity": 999},
        headers=auth_header,
    )
    assert resp.status_code == 400


def test_checkin_success(client, auth_header):
    client.post(
        "/api/projects",
        json={"projectId": "p1", "name": "P1", "description": ""},
        headers=auth_header,
    )
    client.post(
        "/api/hardware/checkout",
        json={"projectId": "p1", "hwSet": "HWSet2", "quantity": 20},
        headers=auth_header,
    )
    resp = client.post(
        "/api/hardware/checkin",
        json={"projectId": "p1", "hwSet": "HWSet2", "quantity": 5},
        headers=auth_header,
    )
    assert resp.status_code == 200
    assert resp.get_json()["availability"] == 85


def test_checkin_exceeds_capacity(client, auth_header):
    client.post(
        "/api/projects",
        json={"projectId": "p1", "name": "P1", "description": ""},
        headers=auth_header,
    )
    resp = client.post(
        "/api/hardware/checkin",
        json={"projectId": "p1", "hwSet": "HWSet1", "quantity": 10},
        headers=auth_header,
    )
    assert resp.status_code == 400


def test_checkin_more_than_checked_out(client, auth_header):
    """Cannot check in more than what the project has checked out."""
    client.post(
        "/api/projects",
        json={"projectId": "p1", "name": "P1", "description": ""},
        headers=auth_header,
    )
    client.post(
        "/api/hardware/checkout",
        json={"projectId": "p1", "hwSet": "HWSet1", "quantity": 5},
        headers=auth_header,
    )
    resp = client.post(
        "/api/hardware/checkin",
        json={"projectId": "p1", "hwSet": "HWSet1", "quantity": 10},
        headers=auth_header,
    )
    assert resp.status_code == 400


def test_hardware_shared_across_projects(client, auth_header):
    """HW capacity is global - shared across all projects."""
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

    client.post(
        "/api/hardware/checkout",
        json={"projectId": "p1", "hwSet": "HWSet1", "quantity": 60},
        headers=auth_header,
    )
    client.post(
        "/api/hardware/checkout",
        json={"projectId": "p2", "hwSet": "HWSet1", "quantity": 30},
        headers=auth_header,
    )

    resp = client.get("/api/hardware", headers=auth_header)
    hw1 = next(h for h in resp.get_json() if h["name"] == "HWSet1")
    assert hw1["availability"] == 10
