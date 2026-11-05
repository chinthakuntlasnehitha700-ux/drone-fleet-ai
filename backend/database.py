from pymongo import MongoClient

MONGO_URL = "mongodb://127.0.0.1:27017/"

client = MongoClient(
    MONGO_URL,
    serverSelectionTimeoutMS=5000
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
        