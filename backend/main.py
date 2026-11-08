
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import (
    drones_collection,
    missions_collection,
    alerts_collection
)

app = FastAPI(
    title="DroneFleet AI API",
    description="AI-Assisted Drone Fleet Management Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "Welcome to DroneFleet AI Backend",
        "status": "Running"
    }


@app.get("/api/health")
def health():
    return {"status": "healthy"}


# Get drones from MongoDB
@app.get("/api/drones")
def get_drones():
    drones = list(drones_collection.find({}, {"_id": 0}))
    return drones


# Get missions from MongoDB
@app.get("/api/missions")
def get_missions():
    missions = list(missions_collection.find({}, {"_id": 0}))
    return missions


# Get alerts from MongoDB
@app.get("/api/alerts")
def get_alerts():
    alerts = list(alerts_collection.find({}, {"_id": 0}))
    return alerts
