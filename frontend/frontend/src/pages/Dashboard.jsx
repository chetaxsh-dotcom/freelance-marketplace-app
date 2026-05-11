import { useEffect, useState } from "react";
import API from "../api/api";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

const Dashboard = () => {

  const [payments, setPayments] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchData();
  }, []);

  // FETCH ALL DATA
  const fetchData = async () => {
    try {

      // PAYMENTS
      const paymentRes = await API.get(`/payments/history/${userId}`);
      setPayments(paymentRes.data);

      // CONTRACTS
      const contractRes = await API.get("/contracts");
      setContracts(contractRes.data);

      // NOTIFICATIONS
      const notifRes = await API.get("/notifications");
      setNotifications(notifRes.data);

    } catch (err) {
      console.error(err);
    }
  };

  // UPDATE CONTRACT
  const updateContract = async (id, status) => {
    try {

      await API.patch(`/contracts/${id}`, {
        status
      });

      alert("✅ Contract Updated");

      fetchData();

    } catch (err) {
      console.log(err);
      alert("❌ Update failed");
    }
  };

  // CALCULATIONS
  const total = payments.reduce((sum, p) => sum + p.amount, 0);

  const completed = payments.filter(
    (p) => p.status === "completed"
  );

  const pending = payments.filter(
    (p) => p.status === "pending"
  );

  const totalCompleted =
    role === "freelancer"
      ? completed.reduce((sum, p) => sum + p.amount, 0)
      : total;

  // PIE DATA
  const pieData = [
    {
      name: "Completed",
      value: completed.length
    },
    {
      name: "Pending",
      value: pending.length
    }
  ];

  // LINE DATA
  const lineData = payments.map((p) => ({
    date: new Date(p.createdAt).toLocaleDateString(),
    amount: p.amount
  }));

  return (
    <div
      style={{
        padding: "30px",
        background: "#f3f4f6",
        minHeight: "100vh"
      }}
    >

      {/* TITLE */}
      <h1>
        {role === "client"
          ? "📊 Client Dashboard"
          : "💼 Freelancer Dashboard"}
      </h1>

      {/* TOP CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px,1fr))",
          gap: "20px",
          marginTop: "25px"
        }}
      >

        {/* TOTAL */}
        <div style={cardStyle}>
          <h3>💰 Total Earnings</h3>
          <p style={numberStyle}>₹{totalCompleted}</p>
        </div>

        {/* TRANSACTIONS */}
        <div style={cardStyle}>
          <h3>📦 Transactions</h3>
          <p style={numberStyle}>{payments.length}</p>
        </div>

        {/* COMPLETED */}
        <div style={cardStyle}>
          <h3>✅ Completed</h3>
          <p style={numberStyle}>{completed.length}</p>
        </div>

        {/* PENDING */}
        <div style={cardStyle}>
          <h3>⏳ Pending</h3>
          <p style={numberStyle}>{pending.length}</p>
        </div>

        {/* CONTRACTS */}
        <div style={cardStyle}>
          <h3>📄 Contracts</h3>
          <p style={numberStyle}>{contracts.length}</p>
        </div>

        {/* NOTIFICATIONS */}
        <div style={cardStyle}>
          <h3>🔔 Notifications</h3>
          <p style={numberStyle}>{notifications.length}</p>
        </div>

      </div>

      {/* PIE CHART */}
      <h2 style={{ marginTop: "50px" }}>
        📊 Payment Status
      </h2>

      <div
        style={{
          width: "100%",
          height: 320,
          background: "white",
          borderRadius: "12px",
          padding: "20px",
          marginTop: "20px"
        }}
      >
        <ResponsiveContainer>
          <PieChart>

            <Pie
              data={pieData}
              dataKey="value"
              outerRadius={100}
              label
            >
              <Cell fill="#16a34a" />
              <Cell fill="#f59e0b" />
            </Pie>

            <Tooltip />

          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* LINE CHART */}
      <h2 style={{ marginTop: "50px" }}>
        📈 Earnings Trend
      </h2>

      <div
        style={{
          width: "100%",
          height: 320,
          background: "white",
          borderRadius: "12px",
          padding: "20px",
          marginTop: "20px"
        }}
      >
        <ResponsiveContainer>

          <LineChart data={lineData}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="date" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="amount"
              stroke="#2563eb"
            />

          </LineChart>

        </ResponsiveContainer>
      </div>

      {/* CONTRACTS */}
      <h2 style={{ marginTop: "50px" }}>
        📄 Contract Updates
      </h2>

      {contracts.length === 0 ? (
        <p>No contracts yet...</p>
      ) : (
        contracts.map((item) => (
          <div
            key={item._id}
            style={sectionStyle}
          >

            <h3>{item.title}</h3>

            <p>
              💰 Budget:
              <strong> ₹{item.amount}</strong>
            </p>

            <p>
              📌 Status:
              <strong
                style={{
                  color:
                    item.status === "completed"
                      ? "green"
                      : item.status === "active"
                      ? "orange"
                      : "red"
                }}
              >
                {" "} {item.status}
              </strong>
            </p>

            {/* BUTTONS */}
            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "12px"
              }}
            >

              <button
                onClick={() =>
                  updateContract(item._id, "active")
                }
                style={activeBtn}
              >
                Active
              </button>

              <button
                onClick={() =>
                  updateContract(item._id, "completed")
                }
                style={completeBtn}
              >
                Complete
              </button>

            </div>

          </div>
        ))
      )}

      {/* TRANSACTIONS */}
      <h2 style={{ marginTop: "50px" }}>
        🧾 Recent Transactions
      </h2>

      {payments.length === 0 ? (
        <p>No transactions yet</p>
      ) : (
        payments.slice(0, 5).map((p) => (
          <div
            key={p._id}
            style={sectionStyle}
          >

            <p>
              <strong>💰 Amount:</strong> ₹{p.amount}
            </p>

            <p>
              <strong>Status:</strong>{" "}

              <span
                style={{
                  color:
                    p.status === "completed"
                      ? "green"
                      : "red",
                  fontWeight: "bold"
                }}
              >
                {p.status}
              </span>
            </p>

            <p>
              <strong>📅 Date:</strong>{" "}
              {new Date(p.createdAt).toLocaleString()}
            </p>

          </div>
        ))
      )}

      {/* NOTIFICATIONS */}
      <h2 style={{ marginTop: "50px" }}>
        🔔 Latest Notifications
      </h2>

      {notifications.length === 0 ? (
        <p>No notifications yet...</p>
      ) : (
        notifications.map((note) => (
          <div
            key={note._id}
            style={sectionStyle}
          >
            {note.message}
          </div>
        ))
      )}

    </div>
  );
};

// CARD STYLE
const cardStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  textAlign: "center",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
};

// NUMBER STYLE
const numberStyle = {
  fontSize: "28px",
  fontWeight: "bold",
  marginTop: "10px",
  color: "#2563eb"
};

// SECTION STYLE
const sectionStyle = {
  background: "white",
  padding: "18px",
  marginTop: "15px",
  borderRadius: "12px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
};

// BUTTONS
const activeBtn = {
  padding: "8px 14px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

const completeBtn = {
  padding: "8px 14px",
  background: "#16a34a",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

export default Dashboard;