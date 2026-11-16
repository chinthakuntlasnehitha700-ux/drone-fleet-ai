
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pymongo.errors import DuplicateKeyError
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


# Password hashing
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


# Request models
class RegisterRequest(BaseModel):
    name: str = Field(min_length=2, max_length=60)
    email: str = Field(min_length=5, max_length=120)
    password: str = Field(min_length=8, max_length=128)


class LoginRequest(BaseModel):
    email: str
    password: str


# Home
@app.get("/")
def home():
    return {
        "message": "Welcome to DroneFleet AI Backend",
        "status": "Running"
    }


# Health
@app.get("/api/health")
def health():
    return {"status": "healthy"}


# Create account
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


# Sign in
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


# Get drones from MongoDB
@app.get("/api/drones")
def get_drones():
    return list(drones_collection.find({}, {"_id": 0}))


# Get missions from MongoDB
@app.get("/api/missions")
def get_missions():
    return list(missions_collection.find({}, {"_id": 0}))


# Get alerts from MongoDB
@app.get("/api/alerts")
def get_alerts():
    return list(alerts_collection.find({}, {"_id": 0}))
