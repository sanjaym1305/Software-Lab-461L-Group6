from flask import Blueprint, request, jsonify, current_app
import jwt
import datetime

from models.user import create_user, authenticate_user

auth_bp = Blueprint("auth", __name__)


def _generate_token(user_id: str) -> str:
    secret = current_app.config["JWT_SECRET_KEY"]
    payload = {
        "userId": user_id,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24),
    }
    return jwt.encode(payload, secret, algorithm="HS256")


def get_current_user() -> str | None:
    """Extract userId from the Authorization header (Bearer token)."""
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return None
    token = auth_header.split(" ", 1)[1]
    try:
        secret = current_app.config["JWT_SECRET_KEY"]
        payload = jwt.decode(token, secret, algorithms=["HS256"])
        return payload["userId"]
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    user_id = data.get("userId", "").strip()
    password = data.get("password", "").strip()

    if not user_id or not password:
        return jsonify({"error": "userId and password are required"}), 400

    try:
        db = current_app.config["db"]
        user = create_user(db, user_id, password)
        token = _generate_token(user["userId"])
        return jsonify({"userId": user["userId"], "token": token}), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 409


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user_id = data.get("userId", "").strip()
    password = data.get("password", "").strip()

    if not user_id or not password:
        return jsonify({"error": "userId and password are required"}), 400

    try:
        db = current_app.config["db"]
        user = authenticate_user(db, user_id, password)
        token = _generate_token(user["userId"])
        return jsonify({"userId": user["userId"], "token": token}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 401
