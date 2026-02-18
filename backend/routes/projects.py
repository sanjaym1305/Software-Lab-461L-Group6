from flask import Blueprint, request, jsonify, current_app

from models.project import (
    create_project,
    get_user_projects,
    get_project,
    join_project,
)
from routes.auth import get_current_user

projects_bp = Blueprint("projects", __name__)


def _require_auth():
    user_id = get_current_user()
    if not user_id:
        return None, (jsonify({"error": "Authentication required"}), 401)
    return user_id, None


@projects_bp.route("/projects", methods=["GET"])
def list_projects():
    user_id, err = _require_auth()
    if err:
        return err

    db = current_app.config["db"]
    projects = get_user_projects(db, user_id)
    return jsonify(projects), 200


@projects_bp.route("/projects", methods=["POST"])
def new_project():
    user_id, err = _require_auth()
    if err:
        return err

    data = request.get_json()
    project_id = data.get("projectId", "").strip()
    name = data.get("name", "").strip()
    description = data.get("description", "").strip()

    if not project_id or not name:
        return jsonify({"error": "projectId and name are required"}), 400

    try:
        db = current_app.config["db"]
        project = create_project(db, project_id, name, description, user_id)
        return jsonify(project), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 409


@projects_bp.route("/projects/<project_id>", methods=["GET"])
def project_detail(project_id):
    user_id, err = _require_auth()
    if err:
        return err

    db = current_app.config["db"]
    project = get_project(db, project_id)

    if not project:
        return jsonify({"error": "Project not found"}), 404

    if user_id not in project.get("members", []):
        return jsonify({"error": "Not a member of this project"}), 403

    return jsonify(project), 200


@projects_bp.route("/projects/<project_id>/join", methods=["POST"])
def join(project_id):
    user_id, err = _require_auth()
    if err:
        return err

    try:
        db = current_app.config["db"]
        project = join_project(db, project_id, user_id)
        return jsonify(project), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
