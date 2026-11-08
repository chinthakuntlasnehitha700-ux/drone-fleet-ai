from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import drones_collection, missions_collection, alerts_collection

app = FastAPI(
    title="DroneFleet AI API",
    description="AI-Assisted Drone Fleet Management Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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

@app.get("/api/drones")
def get_drones():
    return [
        {
            "id": "DR-001",
            "name": "Drone 001",
            "model": "DJI Matrice 350",
            "zone": "Zone A",
            "battery": 92,
            "status": "Online"
        },
        {
            "id": "DR-002",
            "name": "Drone 002",
            "model": "DJI Matrice 350",
            "zone": "Zone B",
            "battery": 78,
            "status": "Online"
        },
        {
            "id": "DR-003",
            "name": "Drone 003",
            "model": "DJI Mavic 3",
            "zone": "Zone C",
            "battery": 45,
            "status": "Maintenance"
        }
    ]

@app.get("/api/missions")
def get_missions():
    return [
        {
            "id": "MS-001",
            "name": "Package Delivery",
            "status": "In Progress",
            "progress": 75
        },
        {
            "id": "MS-002",
            "name": "Area Survey",
            "status": "Completed",
            "progress": 100
        }
    ]

@app.get("/api/alerts")
def get_alerts():
    return [
        {
            "id": 1,
            "message": "Low battery detected",
            "severity": "Warning"
        },
        {
            "id": 2,
            "message": "Maintenance required",
            "severity": "Critical"
        }
    ]