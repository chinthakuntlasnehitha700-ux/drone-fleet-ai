
import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")

if not MONGO_URL:
    raise ValueError("MONGO_URL is missing. Check your .env file.")

client = MongoClient(
    MONGO_URL,
    serverSelectionTimeoutMS=10000
)

db = client["dronefleet_ai"]

drones_collection = db["drones"]
missions_collection = db["missions"]
alerts_collection = db["alerts"]


def check_database_connection():
    try:
        client.admin.command("ping")
        return True
    except Exception as error:
        print("Database connection failed:", error)
        return False
