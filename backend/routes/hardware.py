from flask import Blueprint, request, jsonify, current_app

from models.hardware import get_all_hardware, checkout_hardware, checkin_hardware
from models.project import get_project, update_hw_checkout
from routes.auth import get_current_user

hardware_bp = Blueprint("hardware", __name__)


def _require_auth():
    user_id = get_current_user()
    if not user_id:
        return None, (jsonify({"error": "Authentication required"}), 401)
    return user_id, None


@hardware_bp.route("/hardware", methods=["GET"])
def list_hardware():
    user_id, err = _require_auth()
    if err:
        return err

    db = current_app.config["db"]
    hw_sets = get_all_hardware(db)
    return jsonify(hw_sets), 200


@hardware_bp.route("/hardware/checkout", methods=["POST"])
def checkout():
    user_id, err = _require_auth()
    if err:
        return err

    data = request.get_json()
    project_id = data.get("projectId", "").strip()
    hw_set = data.get("hwSet", "").strip()
    quantity = data.get("quantity", 0)

    if not project_id or not hw_set or not quantity:
        return jsonify({"error": "projectId, hwSet, and quantity are required"}), 400

    try:
        quantity = int(quantity)
    except (ValueError, TypeError):
        return jsonify({"error": "quantity must be a number"}), 400

    db = current_app.config["db"]

    project = get_project(db, project_id)
    if not project:
        return jsonify({"error": "Project not found"}), 404
    if user_id not in project.get("members", []):
        return jsonify({"error": "Not a member of this project"}), 403

    try:
        updated_hw = checkout_hardware(db, hw_set, quantity)
        update_hw_checkout(db, project_id, hw_set, quantity)
        return jsonify(updated_hw), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


@hardware_bp.route("/hardware/checkin", methods=["POST"])
def checkin():
    user_id, err = _require_auth()
    if err:
        return err

    data = request.get_json()
    project_id = data.get("projectId", "").strip()
    hw_set = data.get("hwSet", "").strip()
    quantity = data.get("quantity", 0)

    if not project_id or not hw_set or not quantity:
        return jsonify({"error": "projectId, hwSet, and quantity are required"}), 400

    try:
        quantity = int(quantity)
    except (ValueError, TypeError):
        return jsonify({"error": "quantity must be a number"}), 400

    db = current_app.config["db"]

    project = get_project(db, project_id)
    if not project:
        return jsonify({"error": "Project not found"}), 404
    if user_id not in project.get("members", []):
        return jsonify({"error": "Not a member of this project"}), 403

    try:
        update_hw_checkout(db, project_id, hw_set, -quantity)
        updated_hw = checkin_hardware(db, hw_set, quantity)
        return jsonify(updated_hw), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
