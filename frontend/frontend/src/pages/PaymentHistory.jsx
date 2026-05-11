import { useEffect, useState } from "react";
import API from "../api/api";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState("all");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      fetchPayments();
    }
  }, [userId]);

  const fetchPayments = async () => {
    try {
      const res = await API.get(`/payments/history/${userId}`);
      setPayments(res.data);
    } catch (err) {
      console.error("Payment fetch error:", err);
    }
  };

  // FILTER LOGIC
  const filteredPayments = payments.filter((p) => {
    if (filter === "all") return true;
    return p.status === filter;
  });

  return (
    <div style={{ padding: "30px" }}>
      <h1>💳 Payment History</h1>

      {/* FILTER BUTTONS */}
      <div style={{ 
        marginBottom: "20px", 
        display: "flex", 
        gap: "15px" 
      }}>
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("completed")}>Completed</button>
        <button onClick={() => setFilter("pending")}>Pending</button>
      </div>

      {/* LIST */}
      {filteredPayments.length === 0 ? (
        <p style={{ color: "#777" }}>No transactions found</p>
      ) : (
        filteredPayments.map((p) => (
          <div
            key={p._id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "10px",
              background: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}
          >
            <p><strong>💰 Amount:</strong> ₹{p.amount}</p>

            <p>
              <strong>Status:</strong>{" "}
              <span style={{
                color: p.status === "completed" ? "green" : "orange",
                fontWeight: "bold"
              }}>
                {p.status}
              </span>
            </p>

            <p><strong>📦 Job ID:</strong> {p.jobId}</p>

            <p>
              <strong>📅 Date:</strong>{" "}
              {new Date(p.createdAt).toLocaleString()}
            </p>

          </div>
        ))
      )}
    </div>
  );
};

export default PaymentHistory;