
from database import (
    drones_collection,
    missions_collection,
    alerts_collection
)

# Drone data
drones = [
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

# Mission data
missions = [
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

# Alert data
alerts = [
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

# Insert only if collections are empty
if drones_collection.count_documents({}) == 0:
    drones_collection.insert_many(drones)

if missions_collection.count_documents({}) == 0:
    missions_collection.insert_many(missions)

if alerts_collection.count_documents({}) == 0:
    alerts_collection.insert_many(alerts)

print("DroneFleet AI sample data inserted successfully!")
