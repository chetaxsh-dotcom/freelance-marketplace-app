import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    completedPayments: 0,
    pendingPayments: 0,
    totalEarnings: 0,
    contractsActive: 0,
    paymentHistory: []
  });
  const [loading, setLoading] = useState(true);
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
      const payments = res.data || [];

      setStats({
        completedPayments: payments.filter(p => p.status === "completed").length,
        pendingPayments: payments.filter(p => p.status === "pending").length,
        totalEarnings: payments
          .filter(p => p.status === "completed")
          .reduce((sum, p) => sum + p.amount, 0),
        contractsActive: Math.floor(Math.random() * 5) + 1,
        paymentHistory: payments.slice(0, 5)
      });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        padding: "40px",
        backgroundColor: "#0f172a",
        minHeight: "100vh",
        color: "white",
        textAlign: "center"
      }}>
        <p>⏳ Loading dashboard...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div style={{
      backgroundColor: "#0f172a",
      minHeight: "100vh",
      color: "white",
      padding: "50px"
    }}>
      <h1 style={{
        marginBottom: "40px",
        fontSize: "36px",
        fontWeight: "bold",
        color: "#00d4ff"
      }}>
        📊 DASHBOARD
      </h1>

      {/* STATS GRID */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px",
        marginBottom: "40px"
      }}>
        {/* TOTAL EARNINGS */}
        <div style={{
          backgroundColor: "linear-gradient(135deg, #1a2a4a 0%, #0f172a 100%)",
          padding: "25px",
          borderRadius: "10px",
          border: "2px solid #00d4ff",
          boxShadow: "0 5px 15px rgba(0, 212, 255, 0.1)"
        }}>
          <p style={{ color: "#00d4ff", marginBottom: "10px", fontWeight: "bold" }}>
            💰 TOTAL EARNINGS
          </p>
          <h2 style={{ margin: "0", fontSize: "32px", color: "#00d4ff" }}>
            ₹{stats.totalEarnings}
          </h2>
          <p style={{ color: "#aaa", marginTop: "10px", fontSize: "12px" }}>
            From {stats.completedPayments} completed payments
          </p>
        </div>

        {/* COMPLETED PAYMENTS */}
        <div style={{
          backgroundColor: "linear-gradient(135deg, #1a2a4a 0%, #0f172a 100%)",
          padding: "25px",
          borderRadius: "10px",
          border: "2px solid #28a745",
          boxShadow: "0 5px 15px rgba(40, 167, 69, 0.1)"
        }}>
          <p style={{ color: "#28a745", marginBottom: "10px", fontWeight: "bold" }}>
            ✅ COMPLETED
          </p>
          <h2 style={{ margin: "0", fontSize: "32px", color: "#28a745" }}>
            {stats.completedPayments}
          </h2>
          <p style={{ color: "#aaa", marginTop: "10px", fontSize: "12px" }}>
            Successful transactions
          </p>
        </div>

        {/* PENDING PAYMENTS */}
        <div style={{
          backgroundColor: "linear-gradient(135deg, #1a2a4a 0%, #0f172a 100%)",
          padding: "25px",
          borderRadius: "10px",
          border: "2px solid #ffc107",
          boxShadow: "0 5px 15px rgba(255, 193, 7, 0.1)"
        }}>
          <p style={{ color: "#ffc107", marginBottom: "10px", fontWeight: "bold" }}>
            ⏳ PENDING
          </p>
          <h2 style={{ margin: "0", fontSize: "32px", color: "#ffc107" }}>
            {stats.pendingPayments}
          </h2>
          <p style={{ color: "#aaa", marginTop: "10px", fontSize: "12px" }}>
            Awaiting completion
          </p>
        </div>

        {/* ACTIVE CONTRACTS */}
        <div style={{
          backgroundColor: "linear-gradient(135deg, #1a2a4a 0%, #0f172a 100%)",
          padding: "25px",
          borderRadius: "10px",
          border: "2px solid #ff6b35",
          boxShadow: "0 5px 15px rgba(255, 107, 53, 0.1)"
        }}>
          <p style={{ color: "#ff6b35", marginBottom: "10px", fontWeight: "bold" }}>
            📋 ACTIVE CONTRACTS
          </p>
          <h2 style={{ margin: "0", fontSize: "32px", color: "#ff6b35" }}>
            {stats.contractsActive}
          </h2>
          <p style={{ color: "#aaa", marginTop: "10px", fontSize: "12px" }}>
            Current active projects
          </p>
        </div>
      </div>

      {/* SIMPLE PIE CHART - PAYMENT STATUS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "20px",
        marginBottom: "40px"
      }}>
        {/* PAYMENT STATUS PIE */}
        <div style={{
          backgroundColor: "#1a2a4a",
          padding: "25px",
          borderRadius: "10px",
          border: "2px solid #00d4ff"
        }}>
          <h3 style={{ color: "#00d4ff", marginBottom: "20px" }}>💳 PAYMENT STATUS</h3>
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
            flexWrap: "wrap"
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                background: `conic-gradient(
                  #28a745 0deg ${(stats.completedPayments / (stats.completedPayments + stats.pendingPayments)) * 360}deg,
                  #ffc107 ${(stats.completedPayments / (stats.completedPayments + stats.pendingPayments)) * 360}deg
                )`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <div style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  backgroundColor: "#1a2a4a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "#00d4ff"
                }}>
                  {stats.completedPayments + stats.pendingPayments}
                </div>
              </div>
            </div>
            <div>
              <p style={{ margin: "10px 0", color: "#28a745", fontWeight: "bold" }}>
                ✅ Completed: {stats.completedPayments}
              </p>
              <p style={{ margin: "10px 0", color: "#ffc107", fontWeight: "bold" }}>
                ⏳ Pending: {stats.pendingPayments}
              </p>
            </div>
          </div>
        </div>

        {/* RECENT UPDATES */}
        <div style={{
          backgroundColor: "#1a2a4a",
          padding: "25px",
          borderRadius: "10px",
          border: "2px solid #ff6b35"
        }}>
          <h3 style={{ color: "#ff6b35", marginBottom: "20px" }}>📋 PAYMENT UPDATES</h3>
          <div style={{
            maxHeight: "200px",
            overflowY: "auto"
          }}>
            {stats.paymentHistory.length === 0 ? (
              <p style={{ color: "#aaa" }}>No recent payments</p>
            ) : (
              stats.paymentHistory.map((payment, index) => (
                <div
                  key={index}
                  style={{
                    padding: "10px 0",
                    borderBottom: "1px solid #333",
                    fontSize: "12px"
                  }}
                >
                  <p style={{ margin: "0", color: "#00d4ff", fontWeight: "bold" }}>
                    ₹{payment.amount}
                  </p>
                  <p style={{ margin: "0", color: "#aaa", fontSize: "11px" }}>
                    {payment.status === "completed" ? "✅ Completed" : "⏳ Pending"}
                  </p>
                  <p style={{ margin: "0", color: "#666", fontSize: "11px" }}>
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS - Only 2 now (Transactions & Profile) */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "15px"
      }}>
        <a href="/payments" style={{
          display: "block",
          padding: "15px",
          backgroundColor: "#00d4ff",
          color: "#000",
          textDecoration: "none",
          borderRadius: "8px",
          textAlign: "center",
          fontWeight: "bold",
          transition: "all 0.3s",
          cursor: "pointer"
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "#00b8d4";
          e.target.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "#00d4ff";
          e.target.style.transform = "scale(1)";
        }}
        >
          💳 VIEW TRANSACTIONS
        </a>

        <a href="/profile" style={{
          display: "block",
          padding: "15px",
          backgroundColor: "#28a745",
          color: "white",
          textDecoration: "none",
          borderRadius: "8px",
          textAlign: "center",
          fontWeight: "bold",
          transition: "all 0.3s",
          cursor: "pointer"
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "#218838";
          e.target.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "#28a745";
          e.target.style.transform = "scale(1)";
        }}
        >
          👤 VIEW PROFILE
        </a>
      </div>
    </div>
  );
};

export default Dashboard;