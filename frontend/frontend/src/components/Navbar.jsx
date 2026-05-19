import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/api";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [count, setCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // CHECK IF USER IS LOGGED IN
  useEffect(() => {
    const userData = localStorage.getItem("user");
    setUser(userData ? JSON.parse(userData) : null);
  }, []);

  // FETCH NOTIFICATIONS
  const fetchNotifications = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      const res = await API.get(`/notifications`);
      setCount(res.data?.length || 0);

      if (res.data?.length > 0) {
        const latest = res.data[0];
        const lastSeen = localStorage.getItem("lastNotification");

        if (lastSeen !== latest._id) {
          localStorage.setItem("lastNotification", latest._id);
          // Don't show alert, just update count
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // AUTO REFRESH NOTIFICATIONS
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(() => {
      fetchNotifications();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setUser(null);
    setDropdownOpen(false);
    navigate("/");
    window.location.reload();
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 50px",
        background: "linear-gradient(90deg, #020617, #0f172a)",
        color: "#fff",
        boxShadow: "0 2px 10px rgba(0, 212, 255, 0.2)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        backdropFilter: "blur(10px)"
      }}
    >
      {/* LOGO */}
      <h2
        style={{
          margin: 0,
          cursor: "pointer",
          fontSize: "20px",
          fontWeight: "bold",
          color: "#00d4ff",
          letterSpacing: "2px"
        }}
        onClick={() => navigate("/")}
      >
        🚀 FREELANCE HUB
      </h2>

      {/* NAV */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "center"
        }}
      >
        {/* HOME */}
        <NavButton label=" HOME" path="/" />

        {/* JOBS */}
        <NavButton label=" JOBS" path="/jobs" />

        {/* IF LOGGED IN - SHOW THESE */}
        {user ? (
          <>
            {/* TRANSACTIONS */}
            <NavButton label=" TRANSACTIONS" path="/payments" />

            {/* DASHBOARD */}
            <NavButton label=" DASHBOARD" path="/dashboard" />

            {/* CREATE SERVICE */}
            <button
              onClick={() => navigate("/create-service")}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                background: "#00d4ff",
                color: "#000",
                fontWeight: "bold",
                fontSize: "13px",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#00b8d4";
                e.target.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "#00d4ff";
                e.target.style.transform = "scale(1)";
              }}
            >
              ➕ SERVICE
            </button>

            {/* NOTIFICATION BELL */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => navigate("/notifications")}
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                cursor: "pointer",
                fontSize: "18px",
                position: "relative",
                transition: "transform 0.3s"
              }}
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.3)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            >
              🔔
              {count > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-10px",
                    background: "#ff4444",
                    color: "white",
                    borderRadius: "50%",
                    padding: "2px 7px",
                    fontSize: "11px",
                    fontWeight: "bold",
                    border: "2px solid #020617",
                    minWidth: "18px",
                    textAlign: "center"
                  }}
                >
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </button>
          </div>


            {/* USER PROFILE DROPDOWN */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "2px solid #00d4ff",
                  cursor: "pointer",
                  background: "transparent",
                  color: "#00d4ff",
                  fontWeight: "bold",
                  fontSize: "13px",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#00d4ff";
                  e.target.style.color = "#000";
                }}
                onMouseLeave={(e) => {
                  if (!dropdownOpen) {
                    e.target.style.background = "transparent";
                    e.target.style.color = "#00d4ff";
                  }
                }}
              >
                👤 {user.name}
                <span style={{ transition: "transform 0.3s", transform: dropdownOpen ? "rotate(180deg)" : "rotate(0)" }}>
                  ▼
                </span>
              </button>

              {/* DROPDOWN MENU */}
              {dropdownOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "50px",
                    right: "0",
                    backgroundColor: "rgba(15, 23, 42, 0.98)",
                    border: "2px solid #00d4ff",
                    borderRadius: "8px",
                    minWidth: "280px",
                    boxShadow: "0 10px 30px rgba(0, 212, 255, 0.2)",
                    zIndex: 1001,
                    backdropFilter: "blur(10px)",
                    overflow: "hidden"
                  }}
                >
                  {/* HEADER */}
                  <div
                    style={{
                      padding: "15px 20px",
                      borderBottom: "1px solid #00d4ff",
                      backgroundColor: "rgba(0, 212, 255, 0.1)"
                    }}
                  >
                    <p style={{ margin: "5px 0", fontWeight: "bold", fontSize: "15px", color: "white" }}>
                      {user.name}
                    </p>
                    <p style={{ margin: "5px 0", fontSize: "12px", color: "#aaa" }}>
                      📧 {user.email}
                    </p>
                    <p style={{ margin: "5px 0", fontSize: "12px", color: "#00d4ff", fontWeight: "bold" }}>
                      👤 {user.role.toUpperCase()}
                    </p>
                  </div>

                  {/* MY PROFILE */}
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setDropdownOpen(false);
                    }}
                    style={{
                      width: "100%",
                      padding: "12px 20px",
                      color: "white",
                      backgroundColor: "transparent",
                      border: "none",
                      borderBottom: "1px solid #333",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "all 0.3s",
                      fontSize: "14px"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "rgba(0, 212, 255, 0.1)";
                      e.target.style.color = "#00d4ff";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "transparent";
                      e.target.style.color = "white";
                    }}
                  >
                    👤 MY PROFILE
                  </button>

                  {/* LOGOUT */}
                  <button
                    onClick={handleLogout}
                    style={{
                      width: "100%",
                      padding: "12px 20px",
                      backgroundColor: "transparent",
                      color: "#ff4444",
                      border: "none",
                      borderTop: "1px solid #333",
                      cursor: "pointer",
                      fontWeight: "bold",
                      transition: "all 0.3s",
                      fontSize: "14px",
                      textAlign: "left"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(255, 68, 68, 0.1)";
                      e.currentTarget.style.color = "#ff6b6b";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#ff4444";
                    }}
                  >
                     LOGOUT
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* IF NOT LOGGED IN - SHOW LOGIN/REGISTER */}
            <NavButton label="🔐 LOGIN" path="/login" />
            <button
              onClick={() => navigate("/register")}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                background: "#00d4ff",
                color: "#000",
                fontWeight: "bold",
                fontSize: "13px",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#00b8d4";
                e.target.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "#00d4ff";
                e.target.style.transform = "scale(1)";
              }}
            >
               REGISTER
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;

// REUSABLE BUTTON
function NavButton({ label, path }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(path)}
      style={{
        padding: "8px 16px",
        borderRadius: "6px",
        border: "none",
        cursor: "pointer",
        background: "transparent",
        color: "#fff",
        fontWeight: "bold",
        fontSize: "13px",
        transition: "all 0.3s ease"
      }}
      onMouseEnter={(e) => {
        e.target.style.background = "#00d4ff";
        e.target.style.color = "#000";
        e.target.style.transform = "scale(1.05)";
      }}
      onMouseLeave={(e) => {
        e.target.style.background = "transparent";
        e.target.style.color = "#fff";
        e.target.style.transform = "scale(1)";
      }}
    >
      {label}
    </button>
  );
}