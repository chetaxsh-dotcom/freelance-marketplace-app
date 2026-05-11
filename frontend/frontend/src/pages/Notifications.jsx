import { useEffect, useState } from "react";
import API from "../api/api";

const Notifications = () => {

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {

      const res = await API.get("/notifications");

      setNotifications(res.data);

    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>🔔 Notifications</h1>

      {notifications.length === 0 ? (
        <p>No notification yet...</p>
      ) : (
        notifications.map((item) => (
          <div
            key={item._id}
            style={{
              background: "#fff",
              padding: "12px",
              marginTop: "10px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}
          >
            {item.message}
          </div>
        ))
      )}
    </div>
  );
};

export default Notifications;