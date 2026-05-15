import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/api";


function Navbar() {
  const navigate = useNavigate();

  const [count, setCount] = useState(0);


  // FETCH NOTIFICATIONS
  const fetchNotifications = async () => {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) return;

      const res = await API.get(`/notifications`);

      setCount(res.data.length);

      // SHOW POPUP ONLY FOR NEW NOTIFICATION
      if (res.data.length > 0) {
        const latest = res.data[0];

        const lastSeen = localStorage.getItem("lastNotification");

        if (lastSeen !== latest._id) {
          localStorage.setItem("lastNotification", latest._id);

          alert(`🔔 ${latest.message}`);
        }
      }

    } catch (err) {
      console.error(err);
    }
  };

  // AUTO REFRESH
  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 5000);

    return () => clearInterval(interval);

  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 30px",
        background: "linear-gradient(90deg, #020617, #0f172a)",
        color: "#fff",
        boxShadow: "0 2px 10px rgba(0,0,0,0.2)"
      }}
    >
      {/* LOGO */}
      <h2
        style={{ margin: 0, cursor: "pointer" }}
        onClick={() => navigate("/")}
      >
        FreelanceHub
      </h2>

      {/* NAV */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          alignItems: "center"
        }}
      >
        <NavButton label="Home" path="/" />
        <NavButton label="Jobs" path="/jobs" />
        <NavButton label="Transactions" path="/payments" />
        <NavButton label="Dashboard" path="/dashboard" />
              
              <a 
              href="/create-service" 
              style={{
                padding: '10px 20px',
                color: "#fff",
                borderRadius: '5px',
                textDecoration: 'none',
                fontWeight: 'bold',
                
              }}
              >
      
        ➕ Service
      </a>


        {/* NOTIFICATION */}
        <button
          onClick={() => navigate("/notifications")}
          style={{
            background: "transparent",
            border: "none",
            color: "white",
            cursor: "pointer",
            fontSize: "18px",
            position: "relative"
          }}
        >
          🔔

          {count > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-8px",
                right: "-10px",
                background: "red",
                color: "white",
                borderRadius: "50%",
                padding: "2px 7px",
                fontSize: "11px",
                fontWeight: "bold"
              }}
            >
              {count}
            </span>
          )}
        </button>

        <NavButton label="Login" path="/login" />
        <NavButton label="Register" path="/register" />
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
        transition: "all 0.3s ease"
      }}
      onMouseEnter={(e) => {
        e.target.style.background = "#2563eb";
        e.target.style.transform = "scale(1.05)";
      }}
      onMouseLeave={(e) => {
        e.target.style.background = "transparent";
        e.target.style.transform = "scale(1)";
      }}
    >
      {label}
    </button>
  );
}