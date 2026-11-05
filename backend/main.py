from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database import drones_collection

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
    allow_headers=["*"]
)


@app.get("/")
def home():
    return {"message": "Welcome to DroneFleet AI Backend"}


@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "platform": "DroneFleet AI"
    }


@app.get("/api/drones")
def get_drones():
    drones = list(
        drones_collection.find({}, {"_id": 0})
    )
    return {
        "total_drones": len(drones),
        "drones": drones
    }