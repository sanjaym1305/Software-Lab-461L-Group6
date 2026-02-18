def create_project(db, project_id: str, name: str, description: str, creator: str) -> dict:
    projects = db["projects"]

    if projects.find_one({"projectId": project_id}):
        raise ValueError("Project ID already exists")

    project_doc = {
        "projectId": project_id,
        "name": name,
        "description": description,
        "members": [creator],
        "hwCheckouts": {"HWSet1": 0, "HWSet2": 0},
    }
    projects.insert_one(project_doc)
    project_doc.pop("_id", None)
    return project_doc


def get_user_projects(db, user_id: str) -> list:
    projects = db["projects"]
    cursor = projects.find({"members": user_id}, {"_id": 0})
    return list(cursor)


def get_project(db, project_id: str) -> dict | None:
    projects = db["projects"]
    return projects.find_one({"projectId": project_id}, {"_id": 0})


def join_project(db, project_id: str, user_id: str) -> dict:
    projects = db["projects"]
    project = projects.find_one({"projectId": project_id})

    if not project:
        raise ValueError("Project not found")

    if user_id in project["members"]:
        raise ValueError("Already a member of this project")

    projects.update_one(
        {"projectId": project_id}, {"$addToSet": {"members": user_id}}
    )

    updated = projects.find_one({"projectId": project_id}, {"_id": 0})
    return updated


def update_hw_checkout(db, project_id: str, hw_set: str, delta: int):
    """Update the hardware checkout count for a project. delta is positive for checkout, negative for checkin."""
    projects = db["projects"]
    project = projects.find_one({"projectId": project_id})

    if not project:
        raise ValueError("Project not found")

    current = project["hwCheckouts"].get(hw_set, 0)
    new_val = current + delta

    if new_val < 0:
        raise ValueError(f"Cannot check in more than checked out ({current} checked out)")

    projects.update_one(
        {"projectId": project_id},
        {"$set": {f"hwCheckouts.{hw_set}": new_val}},
    )
