
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pymongo.errors import DuplicateKeyError
from datetime import datetime, timezone
import hashlib
import secrets
import hmac
import re

from backend.database import (
    drones_collection,
    missions_collection,
    alerts_collection,
    users_collection
)

app = FastAPI(
    title="DroneFleet AI API",
    description="AI-Assisted Drone Fleet Management Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://drone-fleet-ai-1.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create unique email index
users_collection.create_index("email", unique=True)


# SAMPLE DATA
# Insert only when a collection is empty.
# Existing records are never deleted or overwritten.

def seed_demo_data():

    drones = [
        {
            "id": "DR-001",
            "drone_id": "DR-001",
            "name": "Drone 001",
            "model": "DJI Matrice 350",
            "location": "Zone A",
            "zone": "Zone A",
            "battery": 92,
            "mission_type": "Delivery",
            "status": "Online"
        },
        {
            "id": "DR-002",
            "drone_id": "DR-002",
            "name": "Drone 002",
            "model": "DJI Mavic 3",
            "location": "Zone B",
            "zone": "Zone B",
            "battery": 78,
            "mission_type": "Survey",
            "status": "Online"
        },
        {
            "id": "DR-003",
            "drone_id": "DR-003",
            "name": "Drone 003",
            "model": "DJI Matrice 300",
            "location": "Zone C",
            "zone": "Zone C",
            "battery": 65,
            "mission_type": "Inspection",
            "status": "In Mission"
        },
        {
            "id": "DR-004",
            "drone_id": "DR-004",
            "name": "Drone 004",
            "model": "DJI Mavic 3",
            "location": "Zone A",
            "zone": "Zone A",
            "battery": 45,
            "mission_type": "Mapping",
            "status": "Charging"
        },
        {
            "id": "DR-005",
            "drone_id": "DR-005",
            "name": "Drone 005",
            "model": "DJI Matrice 350",
            "location": "Zone D",
            "zone": "Zone D",
            "battery": 28,
            "mission_type": "Delivery",
            "status": "Low Battery"
        },
        {
            "id": "DR-006",
            "drone_id": "DR-006",
            "name": "Drone 006",
            "model": "DJI Mavic 3 Enterprise",
            "location": "Zone B",
            "zone": "Zone B",
            "battery": 86,
            "mission_type": "Surveillance",
            "status": "Online"
        }
    ]

    missions = [
        {
            "id": "MS-001",
            "name": "Medical Supply Delivery",
            "mission_name": "Medical Supply Delivery",
            "description": "Deliver medical supplies to the assigned location.",
            "drone_id": "DR-001",
            "location": "Zone A",
            "destination": "Zone A",
            "priority": "High",
            "status": "In Progress",
            "progress": 75
        },
        {
            "id": "MS-002",
            "name": "Area Survey",
            "mission_name": "Area Survey",
            "description": "Survey the assigned area and collect aerial data.",
            "drone_id": "DR-002",
            "location": "Zone B",
            "destination": "Zone B",
            "priority": "Medium",
            "status": "In Progress",
            "progress": 50
        },
        {
            "id": "MS-003",
            "name": "Infrastructure Inspection",
            "mission_name": "Infrastructure Inspection",
            "description": "Inspect infrastructure using drone cameras.",
            "drone_id": "DR-003",
            "location": "Zone C",
            "destination": "Zone C",
            "priority": "High",
            "status": "In Progress",
            "progress": 60
        },
        {
            "id": "MS-004",
            "name": "Mapping Operation",
            "mission_name": "Mapping Operation",
            "description": "Collect aerial mapping information.",
            "drone_id": "DR-004",
            "location": "Zone A",
            "destination": "Zone A",
            "priority": "Low",
            "status": "Pending",
            "progress": 0
        },
        {
            "id": "MS-005",
            "name": "Surveillance Mission",
            "mission_name": "Surveillance Mission",
            "description": "Monitor the assigned operational area.",
            "drone_id": "DR-006",
            "location": "Zone B",
            "destination": "Zone B",
            "priority": "Medium",
            "status": "Completed",
            "progress": 100
        }
    ]

    now = datetime.now(timezone.utc).isoformat()

    alerts = [
        {
            "id": "AL-001",
            "title": "Low Battery Detected",
            "message": "Low Battery Detected",
            "description": "Drone DR-005 battery level is below 30%.",
            "severity": "Warning",
            "type": "Battery",
            "drone_id": "DR-005",
            "status": "Active",
            "created_at": now,
            "timestamp": now
        },
        {
            "id": "AL-002",
            "title": "Maintenance Required",
            "message": "Maintenance Required",
            "description": "Drone DR-003 requires a routine maintenance check.",
            "severity": "Critical",
            "type": "Maintenance",
            "drone_id": "DR-003",
            "status": "Active",
            "created_at": now,
            "timestamp": now
        },
        {
            "id": "AL-003",
            "title": "Drone Charging",
            "message": "Drone Charging",
            "description": "Drone DR-004 is currently charging.",
            "severity": "Info",
            "type": "Battery",
            "drone_id": "DR-004",
            "status": "Active",
            "created_at": now,
            "timestamp": now
        },
        {
            "id": "AL-004",
            "title": "Mission In Progress",
            "message": "Mission In Progress",
            "description": "Drone DR-001 is completing its delivery mission.",
            "severity": "Info",
            "type": "Mission",
            "drone_id": "DR-001",
            "status": "Active",
            "created_at": now,
            "timestamp": now
        }
    ]

    if drones_collection.count_documents({}) == 0:
        drones_collection.insert_many(drones)
        print("Sample drones inserted successfully.")

    if missions_collection.count_documents({}) == 0:
        missions_collection.insert_many(missions)
        print("Sample missions inserted successfully.")

    if alerts_collection.count_documents({}) == 0:
        alerts_collection.insert_many(alerts)
        print("Sample alerts inserted successfully.")


# Run sample data setup when backend starts
@app.on_event("startup")
def startup_event():
    seed_demo_data()


# PASSWORD HASHING

def hash_password(password, salt=None):

    if salt is None:
        salt = secrets.token_hex(16)

    password_hash = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        bytes.fromhex(salt),
        200000
    ).hex()

    return salt, password_hash


# REQUEST MODELS

class RegisterRequest(BaseModel):
    name: str = Field(min_length=2, max_length=60)
    email: str = Field(min_length=5, max_length=120)
    password: str = Field(min_length=8, max_length=128)


class LoginRequest(BaseModel):
    email: str
    password: str


# HOME

@app.get("/")
def home():
    return {
        "message": "Welcome to DroneFleet AI Backend",
        "status": "Running"
    }


# HEALTH

@app.get("/api/health")
def health():
    return {"status": "healthy"}


# REGISTER

@app.post("/api/register")
def register(data: RegisterRequest):

    name = data.name.strip()
    email = data.email.strip().lower()

    if not name:
        raise HTTPException(
            status_code=400,
            detail="Name is required"
        )

    if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", email):
        raise HTTPException(
            status_code=400,
            detail="Enter a valid email address"
        )

    salt, password_hash = hash_password(data.password)

    user = {
        "name": name,
        "email": email,
        "salt": salt,
        "password_hash": password_hash
    }

    try:
        users_collection.insert_one(user)

    except DuplicateKeyError:
        raise HTTPException(
            status_code=409,
            detail="Account already exists. Please sign in."
        )

    return {
        "message": "Account created successfully",
        "user": {
            "name": name,
            "email": email
        }
    }


# LOGIN

@app.post("/api/login")
def login(data: LoginRequest):

    email = data.email.strip().lower()

    user = users_collection.find_one({"email": email})

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    _, entered_hash = hash_password(
        data.password,
        user["salt"]
    )

    if not hmac.compare_digest(
        entered_hash,
        user["password_hash"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    return {
        "message": "Login successful",
        "user": {
            "name": user["name"],
            "email": user["email"]
        }
    }


# GET DRONES

@app.get("/api/drones")
def get_drones():
    return list(
        drones_collection.find({}, {"_id": 0})
    )


# GET MISSIONS

@app.get("/api/missions")
def get_missions():
    return list(
        missions_collection.find({}, {"_id": 0})
    )


# GET ALERTS

@app.get("/api/alerts")
def get_alerts():
    return list(
        alerts_collection.find({}, {"_id": 0})
    )
