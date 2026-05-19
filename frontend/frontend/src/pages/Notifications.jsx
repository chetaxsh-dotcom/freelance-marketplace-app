import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(userData));
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    // Mock notifications - replace with API call
    const mockNotifications = [
      {
        id: 1,
        title: "Payment Received",
        message: "You received ₹5000 for Web Development service",
        timestamp: new Date(Date.now() - 1000000),
        icon: "💰",
        read: false
      },
      {
        id: 2,
        title: "Service Approved",
        message: "Your Graphic Design service has been approved",
        timestamp: new Date(Date.now() - 2000000),
        icon: "✅",
        read: false
      },
      {
        id: 3,
        title: "New Hire Request",
        message: "John hired you for Web Development",
        timestamp: new Date(Date.now() - 3000000),
        icon: "💼",
        read: true
      },
      {
        id: 4,
        title: "Profile Updated",
        message: "Your profile information was successfully updated",
        timestamp: new Date(Date.now() - 4000000),
        icon: "👤",
        read: true
      }
    ];
    setNotifications(mockNotifications);
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div style={{
      backgroundColor: "#0f0f0f",
      minHeight: "100vh",
      color: "white",
      padding: "50px"
    }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <h1 style={{ fontSize: "36px", fontWeight: "bold" }}>🔔 NOTIFICATIONS</h1>
          {notifications.some(n => !n.read) && (
            <button
              onClick={markAllAsRead}
              style={{
                padding: "8px 15px",
                backgroundColor: "#00d4ff",
                color: "#000",
                border: "none",
                borderRadius: "5px",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "13px"
              }}
            >
              Mark All as Read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "40px",
            backgroundColor: "#1a1a1a",
            borderRadius: "10px",
            border: "1px solid #333"
          }}>
            <p style={{ fontSize: "18px", color: "#aaa" }}>📭 No notifications</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {notifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => markAsRead(notif.id)}
                style={{
                  backgroundColor: notif.read ? "#1a1a1a" : "rgba(0, 212, 255, 0.1)",
                  border: `1px solid ${notif.read ? "#333" : "#00d4ff"}`,
                  padding: "20px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#00d4ff";
                  e.currentTarget.style.transform = "translateX(5px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = notif.read ? "#333" : "#00d4ff";
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                <div style={{ flex: 1 }}>
                  <p style={{
                    margin: "0 0 8px 0",
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "#fff"
                  }}>
                    {notif.icon} {notif.title}
                  </p>
                  <p style={{
                    margin: "0 0 8px 0",
                    fontSize: "14px",
                    color: "#aaa"
                  }}>
                    {notif.message}
                  </p>
                  <p style={{
                    margin: "0",
                    fontSize: "12px",
                    color: "#666"
                  }}>
                    {new Date(notif.timestamp).toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notif.id);
                  }}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    color: "#ff4444",
                    cursor: "pointer",
                    fontSize: "18px",
                    transition: "transform 0.3s"
                  }}
                  onMouseEnter={(e) => (e.target.style.transform = "scale(1.3)")}
                  onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;