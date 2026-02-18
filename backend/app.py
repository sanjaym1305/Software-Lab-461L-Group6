from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient

import config
from routes.auth import auth_bp
from routes.projects import projects_bp
from routes.hardware import hardware_bp


def create_app(test_config=None):
    app = Flask(__name__)
    CORS(app, supports_credentials=True)

    if test_config:
        app.config.update(test_config)
        db_client = MongoClient(test_config.get("MONGODB_URI", config.MONGODB_URI))
        db_name = test_config.get("DB_NAME", "haas_test_db")
    else:
        db_client = MongoClient(config.MONGODB_URI)
        db_name = "haas_db"

    db = db_client[db_name]

    app.config["db"] = db
    app.config["JWT_SECRET_KEY"] = config.JWT_SECRET_KEY

    _initialize_hardware(db)

    app.register_blueprint(auth_bp, url_prefix="/api")
    app.register_blueprint(projects_bp, url_prefix="/api")
    app.register_blueprint(hardware_bp, url_prefix="/api")

    @app.route("/api/health")
    def health():
        return {"status": "ok"}

    return app


def _initialize_hardware(db):
    """Seed HWSet1 and HWSet2 if they don't already exist."""
    hw_collection = db["hardware"]
    for name, capacity in [
        ("HWSet1", config.HWSET1_CAPACITY),
        ("HWSet2", config.HWSET2_CAPACITY),
    ]:
        if not hw_collection.find_one({"name": name}):
            hw_collection.insert_one(
                {"name": name, "capacity": capacity, "availability": capacity}
            )


if __name__ == "__main__":
    application = create_app()
    application.run(debug=True, port=5050)
