import { useEffect, useState } from "react";
import "./App.css";

const menuItems = [
  { name: "Dashboard", icon: "▦" },
  { name: "Drones", icon: "🚁" },
  { name: "Live Map", icon: "⌖" },
  { name: "Missions", icon: "◆" },
  { name: "Battery", icon: "▰" },
  { name: "Docking Stations", icon: "⌂" },
  { name: "AI Predictions", icon: "✦" },
  { name: "Alerts", icon: "!" },
  { name: "Reports", icon: "▤" },
  { name: "Settings", icon: "⚙" },
];

const drones = [
  {
    id: "DR-001",
    model: "DJI Matrice 350",
    zone: "Zone A",
    battery: 92,
    status: "Online",
    mission: "Delivery",
  },
  {
    id: "DR-002",
    model: "DJI Matrice 350",
    zone: "Zone B",
    battery: 84,
    status: "Online",
    mission: "Survey",
  },
  {
    id: "DR-003",
    model: "DJI Matrice 300",
    zone: "Zone C",
    battery: 76,
    status: "Online",
    mission: "Inspection",
  },
  {
    id: "DR-004",
    model: "DJI Mavic 3",
    zone: "Zone A",
    battery: 65,
    status: "Online",
    mission: "Mapping",
  },
  {
    id: "DR-005",
    model: "DJI Matrice 350",
    zone: "Zone D",
    battery: 58,
    status: "Maintenance",
    mission: "None",
  },
  {
    id: "DR-006",
    model: "DJI Matrice 350",
    zone: "Zone B",
    battery: 45,
    status: "Online",
    mission: "Survey",
  },
];

const missions = [
  {
    id: "MS-001",
    name: "Zone A Delivery",
    drone: "DR-001",
    progress: 78,
    status: "In Progress",
  },
  {
    id: "MS-002",
    name: "Zone B Survey",
    drone: "DR-002",
    progress: 56,
    status: "In Progress",
  },
  {
    id: "MS-003",
    name: "Building Inspection",
    drone: "DR-003",
    progress: 32,
    status: "In Progress",
  },
  {
    id: "MS-004",
    name: "Area Mapping",
    drone: "DR-004",
    progress: 91,
    status: "Almost Complete",
  },
  {
    id: "MS-005",
    name: "Emergency Survey",
    drone: "DR-006",
    progress: 20,
    status: "Started",
  },
];

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState("Dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const [droneData, setDroneData] = useState(drones);
  const [missionData, setMissionData] = useState(missions);
  const [alertData, setAlertData] = useState([]);
  const [apiStatus, setApiStatus] = useState("Connecting...");

  useEffect(() => {
    const loadBackendData = async () => {
      try {
        const [
          healthResponse,
          dronesResponse,
          missionsResponse,
          alertsResponse,
        ] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/health"),
          fetch("http://127.0.0.1:8000/api/drones"),
          fetch("http://127.0.0.1:8000/api/missions"),
          fetch("http://127.0.0.1:8000/api/alerts"),
        ]);

        if (
          !healthResponse.ok ||
          !dronesResponse.ok ||
          !missionsResponse.ok ||
          !alertsResponse.ok
        ) {
          throw new Error("Backend API request failed");
        }

        const health = await healthResponse.json();
        const droneResults = await dronesResponse.json();
        const missionResults = await missionsResponse.json();
        const alertResults = await alertsResponse.json();

        setDroneData(
          droneResults.map((drone) => ({
            ...drone,
            mission: "None",
          }))
        );

        setMissionData(
          missionResults.map((mission) => ({
            ...mission,
            drone: "Unassigned",
          }))
        );

        setAlertData(alertResults);

        setApiStatus(
          health.status === "healthy" ? "Connected" : "Unavailable"
        );
      } catch (error) {
        console.error("Backend connection error:", error);
        setApiStatus("Disconnected");
      }
    };

    loadBackendData();
  }, []);

  const handleLogin = (event) => {
    event.preventDefault();
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return (
      <>
        <style>{`
          body {
            margin: 0;
            font-family: Inter, Arial, sans-serif;
            background: #f4f7fb;
          }
        `}</style>

        <div className="login-page">
          <div className="login-card">
            <div className="login-logo">🚁</div>

            <h1>DroneFleet AI</h1>

            <p className="login-description">
              AI-Assisted Drone Fleet Management Platform
            </p>

            <div className="login-heading">
              <h2>Welcome back</h2>
              <p>Sign in to access your fleet control center</p>
            </div>

            <form onSubmit={handleLogin}>
              <label>Email Address</label>
              <input
                type="email"
                placeholder="admin@example.com"
                required
              />

              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                required
              />

              <button className="primary-button" type="submit">
                Sign In
              </button>
            </form>

            <p className="secure-text">
              🔒 Secure fleet management system
            </p>
          </div>
        </div>
      </>
    );
  }

  const renderDashboard = () => (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">FLEET OVERVIEW</p>
          <h1>Dashboard</h1>
          <p>Monitor your entire drone fleet from one place.</p>
        </div>

        <button
          className="primary-button small-button"
          onClick={() => setActivePage("Missions")}
        >
          + New Mission
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">🚁</div>
          <div>
            <span>Total Drones</span>
            <h2>12</h2>
            <small>Fleet capacity</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">●</div>
          <div>
            <span>Active Drones</span>
            <h2>8</h2>
            <small>Currently online</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">◆</div>
          <div>
            <span>Active Missions</span>
            <h2>5</h2>
            <small>In progress</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">♥</div>
          <div>
            <span>Fleet Health</span>
            <h2>92%</h2>
            <small>Overall condition</small>
          </div>
        </div>
      </div>

      <div className="two-column">
        <div className="panel">
          <div className="panel-title">
            <div>
              <h3>Fleet Status</h3>
              <p>Current drone availability</p>
            </div>
            <span className="live-badge">● LIVE</span>
          </div>

          <div className="status-item">
            <div>
              <span className="status-dot green-dot"></span>
              Online
            </div>
            <strong>8</strong>
          </div>

          <div className="status-item">
            <div>
              <span className="status-dot gray-dot"></span>
              Offline
            </div>
            <strong>2</strong>
          </div>

          <div className="status-item">
            <div>
              <span className="status-dot orange-dot"></span>
              Maintenance
            </div>
            <strong>2</strong>
          </div>
        </div>

        <div className="panel">
          <div className="panel-title">
            <div>
              <h3>AI Insights</h3>
              <p>Latest intelligent predictions</p>
            </div>
            <span className="ai-symbol">✦</span>
          </div>

          <div className="insight">
            <strong>Battery Prediction</strong>
            <p>2 drones may require battery attention soon.</p>
          </div>

          <div className="insight">
            <strong>Maintenance Prediction</strong>
            <p>1 drone requires preventive maintenance.</p>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-title">
          <div>
            <h3>Active Missions</h3>
            <p>Mission progress overview</p>
          </div>

          <button
            className="text-button"
            onClick={() => setActivePage("Missions")}
          >
            View All →
          </button>
        </div>

        <div className="mission-list">
          {missionData.slice(0, 3).map((mission) => (
            <div className="mission-row" key={mission.id}>
              <div>
                <strong>{mission.name}</strong>
                <small>
                  {mission.id} • {mission.drone}
                </small>
              </div>

              <div className="progress-container">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${mission.progress}%` }}
                  ></div>
                </div>

                <span>{mission.progress}%</span>
              </div>

              <span className="status-badge blue-badge">
                {mission.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderDrones = () => (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">FLEET MANAGEMENT</p>
          <h1>Drones</h1>
          <p>View and manage all registered drones.</p>
        </div>

        <button className="primary-button small-button">
          + Add Drone
        </button>
      </div>

      <div className="table-panel">
        <table>
          <thead>
            <tr>
              <th>Drone ID</th>
              <th>Model</th>
              <th>Zone</th>
              <th>Battery</th>
              <th>Status</th>
              <th>Mission</th>
            </tr>
          </thead>

          <tbody>
            {droneData.map((drone) => (
              <tr key={drone.id}>
                <td>
                  <strong>{drone.id}</strong>
                </td>

                <td>{drone.model}</td>
                <td>{drone.zone}</td>

                <td>
                  <div className="battery-cell">
                    <div className="mini-progress">
                      <div
                        style={{ width: `${drone.battery}%` }}
                      ></div>
                    </div>

                    <span>{drone.battery}%</span>
                  </div>
                </td>

                <td>
                  <span
                    className={`status-badge ${
                      drone.status === "Online"
                        ? "green-badge"
                        : "orange-badge"
                    }`}
                  >
                    {drone.status}
                  </span>
                </td>

                <td>{drone.mission}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderMap = () => (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">REAL-TIME MONITORING</p>
          <h1>Live Map</h1>
          <p>Monitor drone locations and fleet activity.</p>
        </div>

        <span className="live-badge">● LIVE TRACKING</span>
      </div>

      <div className="map-container">
        <div className="map-grid"></div>

        <div className="map-label label-one">Zone A</div>
        <div className="map-label label-two">Zone B</div>
        <div className="map-label label-three">Zone C</div>
        <div className="map-label label-four">Zone D</div>

        <div className="drone-marker marker-one">🚁</div>
        <div className="drone-marker marker-two">🚁</div>
        <div className="drone-marker marker-three">🚁</div>

        <div className="map-center">
          <h3>Fleet Operations Area</h3>
          <p>6 drones currently tracked</p>
        </div>
      </div>
    </>
  );

  const renderMissions = () => (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">MISSION CONTROL</p>
          <h1>Missions</h1>
          <p>Create, monitor and manage drone missions.</p>
        </div>

        <button className="primary-button small-button">
          + Create Mission
        </button>
      </div>

      <div className="mission-cards">
        {missionData.map((mission) => (
          <div className="mission-card" key={mission.id}>
            <div className="mission-top">
              <span className="mission-id">{mission.id}</span>

              <span className="status-badge blue-badge">
                {mission.status}
              </span>
            </div>

            <h3>{mission.name}</h3>

            <p>Assigned Drone: {mission.drone}</p>

            <div className="mission-progress">
              <div className="progress-label">
                <span>Progress</span>
                <strong>{mission.progress}%</strong>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${mission.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const renderBattery = () => (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">BATTERY MONITORING</p>
          <h1>Battery</h1>
          <p>Monitor battery health and predict recharge requirements.</p>
        </div>
      </div>

      <div className="battery-grid">
        {droneData.map((drone) => (
          <div className="battery-card" key={drone.id}>
            <div className="battery-header">
              <strong>{drone.id}</strong>
              <span>{drone.battery}%</span>
            </div>

            <div className="large-battery">
              <div
                className={
                  drone.battery < 50
                    ? "battery-fill low"
                    : "battery-fill"
                }
                style={{ width: `${drone.battery}%` }}
              ></div>
            </div>

            <p>{drone.model}</p>

            <span
              className={`status-badge ${
                drone.battery < 50
                  ? "orange-badge"
                  : "green-badge"
              }`}
            >
              {drone.battery < 50
                ? "Attention Required"
                : "Healthy"}
            </span>
          </div>
        ))}
      </div>
    </>
  );

  const renderDocking = () => (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">INFRASTRUCTURE</p>
          <h1>Docking Stations</h1>
          <p>Monitor charging and docking station availability.</p>
        </div>

        <button className="primary-button small-button">
          + Add Station
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">⌂</div>
          <div>
            <span>Total Stations</span>
            <h2>4</h2>
            <small>Registered stations</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">✓</div>
          <div>
            <span>Available</span>
            <h2>3</h2>
            <small>Ready for docking</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">⚡</div>
          <div>
            <span>Charging</span>
            <h2>1</h2>
            <small>Currently charging</small>
          </div>
        </div>
      </div>

      <div className="station-grid">
        {["DS-001", "DS-002", "DS-003", "DS-004"].map(
          (station, index) => (
            <div className="station-card" key={station}>
              <div className="station-icon">⌂</div>

              <h3>{station}</h3>

              <p>Zone {String.fromCharCode(65 + index)}</p>

              <span
                className={`status-badge ${
                  index === 1
                    ? "orange-badge"
                    : "green-badge"
                }`}
              >
                {index === 1 ? "Charging" : "Available"}
              </span>
            </div>
          )
        )}
      </div>
    </>
  );

  const renderAI = () => (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">ARTIFICIAL INTELLIGENCE</p>
          <h1>AI Predictions</h1>
          <p>AI-assisted insights for smarter fleet operations.</p>
        </div>

        <span className="ai-badge">✦ AI ACTIVE</span>
      </div>

      <div className="prediction-grid">
        <div className="prediction-card">
          <div className="prediction-icon">🔋</div>
          <h3>Battery Prediction</h3>
          <strong>87%</strong>
          <p>
            Predicted battery efficiency across active drones.
          </p>
        </div>

        <div className="prediction-card">
          <div className="prediction-icon">🔧</div>
          <h3>Maintenance Risk</h3>
          <strong>Low</strong>
          <p>Overall maintenance risk is currently low.</p>
        </div>

        <div className="prediction-card">
          <div className="prediction-icon">🎯</div>
          <h3>Mission Success</h3>
          <strong>94%</strong>
          <p>
            Predicted success rate for active missions.
          </p>
        </div>

        <div className="prediction-card">
          <div className="prediction-icon">⚡</div>
          <h3>Energy Forecast</h3>
          <strong>12.4 kWh</strong>
          <p>
            Estimated energy requirement for upcoming missions.
          </p>
        </div>
      </div>

      <div className="panel">
        <div className="panel-title">
          <div>
            <h3>AI Recommendations</h3>
            <p>Suggested actions based on fleet data</p>
          </div>
        </div>

        <div className="recommendation">
          <span>01</span>

          <div>
            <strong>Recharge DR-006</strong>

            <p>
              Battery level is below the recommended operational threshold.
            </p>
          </div>
        </div>

        <div className="recommendation">
          <span>02</span>

          <div>
            <strong>Schedule Preventive Maintenance</strong>

            <p>
              DR-005 is recommended for maintenance before the next mission.
            </p>
          </div>
        </div>
      </div>
    </>
  );

  // BACKEND CONNECTED ALERTS
  const renderAlerts = () => (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">SYSTEM MONITORING</p>
          <h1>Alerts</h1>
          <p>Review important fleet and system notifications.</p>
        </div>
      </div>

      <div className="alert-list">
        {alertData.length === 0 ? (
          <p>No alerts available from the backend.</p>
        ) : (
          alertData.map((alert) => (
            <div
              className={`alert-card ${
                alert.severity === "Critical"
                  ? "danger"
                  : "warning"
              }`}
              key={alert.id}
            >
              <div className="alert-icon">!</div>

              <div>
                <h3>{alert.severity}</h3>

                <p>{alert.message}</p>

                <small>Alert ID: {alert.id}</small>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );

  const renderReports = () => (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">ANALYTICS & REPORTING</p>
          <h1>Reports</h1>
          <p>View fleet performance and operational analytics.</p>
        </div>

        <button className="primary-button small-button">
          Export Report
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">◆</div>
          <div>
            <span>Total Missions</span>
            <h2>48</h2>
            <small>This month</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">✓</div>
          <div>
            <span>Completed</span>
            <h2>43</h2>
            <small>89.5% success</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">⏱</div>
          <div>
            <span>Flight Hours</span>
            <h2>126</h2>
            <small>This month</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">⚡</div>
          <div>
            <span>Energy Used</span>
            <h2>342</h2>
            <small>kWh</small>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-title">
          <div>
            <h3>Mission Performance</h3>
            <p>Monthly mission statistics</p>
          </div>
        </div>

        <div className="chart-placeholder">
          <div className="chart-bars">
            {[55, 72, 48, 82, 65, 92, 76, 88, 70, 96, 84, 90].map(
              (height, index) => (
                <div className="chart-column" key={index}>
                  <div
                    className="chart-bar"
                    style={{ height: `${height}%` }}
                  ></div>

                  <small>{index + 1}</small>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );

  const renderSettings = () => (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">SYSTEM CONFIGURATION</p>
          <h1>Settings</h1>
          <p>Manage your fleet platform preferences.</p>
        </div>
      </div>

      <div className="settings-panel">
        <div className="settings-section">
          <h3>Account Settings</h3>

          <div className="setting-row">
            <div>
              <strong>Administrator Name</strong>
              <p>Manage the current administrator profile.</p>
            </div>

            <input value="Admin" readOnly />
          </div>

          <div className="setting-row">
            <div>
              <strong>Email Notifications</strong>
              <p>Receive important fleet alerts by email.</p>
            </div>

            <button className="toggle active-toggle">
              <span></span>
            </button>
          </div>
        </div>

        <div className="settings-section">
          <h3>Appearance</h3>

          <div className="setting-row">
            <div>
              <strong>Dark Mode</strong>
              <p>Switch the dashboard appearance.</p>
            </div>

            <button
              className={`toggle ${
                darkMode ? "active-toggle" : ""
              }`}
              onClick={() => setDarkMode(!darkMode)}
            >
              <span></span>
            </button>
          </div>
        </div>

        <div className="settings-section">
          <h3>System</h3>

          <div className="setting-row">
            <div>
              <strong>API Status</strong>
              <p>Backend REST API connection status.</p>
            </div>

            <span
              className={`status-badge ${
                apiStatus === "Connected"
                  ? "green-badge"
                  : "orange-badge"
              }`}
            >
              {apiStatus}
            </span>
          </div>
        </div>
      </div>
    </>
  );

  const renderPage = () => {
    switch (activePage) {
      case "Drones":
        return renderDrones();

      case "Live Map":
        return renderMap();

      case "Missions":
        return renderMissions();

      case "Battery":
        return renderBattery();

      case "Docking Stations":
        return renderDocking();

      case "AI Predictions":
        return renderAI();

      case "Alerts":
        return renderAlerts();

      case "Reports":
        return renderReports();

      case "Settings":
        return renderSettings();

      default:
        return renderDashboard();
    }
  };

  return (
    <div className={`app-layout ${darkMode ? "dark-theme" : ""}`}>
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">🚁</div>

          <div>
            <strong>DroneFleet</strong>
            <span>AI Platform</span>
          </div>
        </div>

        <div className="nav-title">MAIN MENU</div>

        <nav className="navigation">
          {menuItems.map((item) => (
            <button
              key={item.name}
              className={`nav-item ${
                activePage === item.name ? "active" : ""
              }`}
              onClick={() => setActivePage(item.name)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="security-card">
            <span>🔒</span>

            <div>
              <strong>System Secure</strong>
              <small>All systems operational</small>
            </div>
          </div>

          <button
            className="logout-button"
            onClick={() => setIsLoggedIn(false)}
          >
            ⇥ Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="welcome-small">
              {new Date().getHours() < 12
                ? "Good morning"
                : new Date().getHours() < 18
                ? "Good afternoon"
                : "Good evening"}
              , Admin
            </p>

            <h2>{activePage}</h2>
          </div>

          <div className="topbar-actions">
            <button
              className="notification-button"
              onClick={() => {
                setShowNotification(!showNotification);
                setActivePage("Alerts");
              }}
            >
              🔔
              <span className="notification-dot"></span>
            </button>

            <div className="profile">
              <div className="avatar">A</div>

              <div>
                <strong>Admin</strong>
                <small>Fleet Manager</small>
              </div>
            </div>
          </div>

          {showNotification && (
            <div className="notification-popup">
              <strong>Notifications</strong>
              <p>DR-006 battery is at 45%.</p>
              <p>DR-005 requires maintenance.</p>
            </div>
          )}
        </header>

        <div className="content-area">{renderPage()}</div>

        <footer className="footer">
          <span>© 2026 DroneFleet AI</span>
          <span>
            AI-Assisted Drone Fleet Management Platform
          </span>
        </footer>
      </main>
    </div>
  );
}

export default App;