import streamlit as st
import requests
import pandas as pd

st.set_page_config(
    page_title="DroneFleet AI",
    page_icon="🚁",
    layout="wide"
)

API_URL = "http://127.0.0.1:8001/api/drones"

st.title("🚁 DroneFleet AI")
st.subheader("AI-Assisted Drone Fleet Management Platform")

try:
    response = requests.get(API_URL, timeout=10)
    response.raise_for_status()

    data = response.json()
    drones = data["drones"]

    total = len(drones)
    active = sum(1 for d in drones if d["status"] == "Online")
    charging = sum(1 for d in drones if d["status"] == "Charging")
    maintenance = sum(
        1 for d in drones if d["status"] == "Maintenance"
    )

    col1, col2, col3, col4 = st.columns(4)

    col1.metric("Total Drones", total)
    col2.metric("Active Drones", active)
    col3.metric("Charging", charging)
    col4.metric("Maintenance", maintenance)

    st.divider()

    st.subheader("Drone Fleet Details")

    df = pd.DataFrame(drones)
    st.dataframe(df, width="stretch")

except requests.exceptions.RequestException as error:
    st.error("Backend connection failed.")
    st.write(error)