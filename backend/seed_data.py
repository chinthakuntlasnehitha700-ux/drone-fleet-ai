from backend.database import drones_collection

drone_data = [
    {
        "drone_id": "DR-001",
        "name": "DJI Matrice 350",
        "location": "Zone A",
        "battery": 92,
        "status": "Online",
        "mission": "Delivery"
    },
    {
        "drone_id": "DR-002",
        "name": "DJI Mavic 3",
        "location": "Zone B",
        "battery": 85,
        "status": "Online",
        "mission": "Survey"
    },
    {
        "drone_id": "DR-003",
        "name": "DJI Matrice 300",
        "location": "Zone C",
        "battery": 65,
        "status": "Online",
        "mission": "Inspection"
    },
    {
        "drone_id": "DR-004",
        "name": "DJI Mavic 3",
        "location": "Zone A",
        "battery": 45,
        "status": "Charging",
        "mission": "None"
    },
    {
        "drone_id": "DR-005",
        "name": "DJI Matrice 350",
        "location": "Zone B",
        "battery": 78,
        "status": "Online",
        "mission": "Mapping"
    },
    {
        "drone_id": "DR-006",
        "name": "DJI Matrice 350",
        "location": "Zone C",
        "battery": 30,
        "status": "Maintenance",
        "mission": "None"
    }
]

for drone in drone_data:
    drones_collection.update_one(
        {"drone_id": drone["drone_id"]},
        {"$set": drone},
        upsert=True
    )

print("6 Drone records inserted successfully!")