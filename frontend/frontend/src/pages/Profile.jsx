import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    servicesCreated: 0,
    paymentsMade: 0,
    totalSpent: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    fetchStats(parsedUser._id);
  }, []);

  const fetchStats = async (userId) => {
    try {
      const res = await API.get(`/payments/history/${userId}`);
      setStats({
        paymentsMade: res.data.filter(p => p.status === "completed").length,
        totalSpent: res.data.reduce((sum, p) => sum + (p.status === "completed" ? p.amount : 0), 0)
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <h1>👤 My Profile</h1>

        {/* Profile Card */}
        <div
          style={{
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            marginBottom: "20px"
          }}
        >
          <h2 style={{ marginBottom: "20px" }}>{user.name}</h2>

          <div style={{ fontSize: "16px", marginBottom: "10px" }}>
            <p>
              <strong>📧 Email:</strong> {user.email}
            </p>
            <p>
              <strong>👤 Role:</strong> {user.role}
            </p>
            <p>
              <strong>⭐ Member Since:</strong> {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "15px",
            marginBottom: "20px"
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}
          >
            <p style={{ color: "#666" }}>Payments Made</p>
            <h3 style={{ color: "#007bff" }}>{stats.paymentsMade}</h3>
          </div>

          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}
          >
            <p style={{ color: "#666" }}>Total Spent</p>
            <h3 style={{ color: "#28a745" }}>₹{stats.totalSpent}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;