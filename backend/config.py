import os
from dotenv import load_dotenv
import certifi
from pymongo import MongoClient
load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb+srv://sanjaym13_db:Universe113_@softwarelabgroup6.fwowcy3.mongodb.net/HardwareSetG6?appName=SoftwareLabGroup6")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-secret-key-change-in-production")
HWSET1_CAPACITY = int(os.getenv("HWSET1_CAPACITY", "100"))
HWSET2_CAPACITY = int(os.getenv("HWSET2_CAPACITY", "100"))

client = MongoClient(
    MONGODB_URI,
    tls=True,
    tlsCAFile=certifi.where()
)

db = client.get_default_database()