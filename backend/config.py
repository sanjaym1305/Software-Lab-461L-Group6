import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/haas_db")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-secret-key-change-in-production")
HWSET1_CAPACITY = int(os.getenv("HWSET1_CAPACITY", "100"))
HWSET2_CAPACITY = int(os.getenv("HWSET2_CAPACITY", "100"))
