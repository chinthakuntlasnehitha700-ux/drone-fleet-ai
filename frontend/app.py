import streamlit as st

st.set_page_config(
    page_title="DroneFleet AI",
    page_icon="🚁",
    layout="wide"
)

st.title("🚁 DroneFleet AI")
st.subheader("AI-Assisted Drone Fleet Management Platform")

st.write("Welcome to your Drone Fleet Control Center")

col1, col2, col3, col4 = st.columns(4)

col1.metric("Total Drones", "12")
col2.metric("Active Drones", "8")
col3.metric("Active Missions", "5")
col4.metric("Fleet Health", "92%")

st.divider()

st.subheader("Fleet Overview")

st.info("Your DroneFleet AI dashboard is ready for development.")