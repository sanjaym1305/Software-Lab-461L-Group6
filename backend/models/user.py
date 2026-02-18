from utils.encryption import hash_password, check_password


def create_user(db, user_id: str, password: str) -> dict:
    """Register a new user. Returns the created user doc (without password)."""
    users = db["users"]

    if users.find_one({"userId": user_id}):
        raise ValueError("User already exists")

    hashed = hash_password(password)
    user_doc = {"userId": user_id, "password": hashed}
    users.insert_one(user_doc)

    return {"userId": user_id}


def authenticate_user(db, user_id: str, password: str) -> dict:
    """Verify credentials. Returns user doc on success, raises on failure."""
    users = db["users"]
    user = users.find_one({"userId": user_id})

    if not user:
        raise ValueError("Invalid credentials")

    if not check_password(password, user["password"]):
        raise ValueError("Invalid credentials")

    return {"userId": user["userId"]}


def find_user(db, user_id: str):
    users = db["users"]
    user = users.find_one({"userId": user_id}, {"password": 0})
    return user
