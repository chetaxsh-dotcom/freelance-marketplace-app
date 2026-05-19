import { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?._id;

      if (!userId) {
        navigate("/login");
        return;
      }

      console.log("📋 Fetching payment history for:", userId);

      const res = await API.get(`/payments/history/${userId}`);

      console.log("✅ Payments fetched:", res.data);

      setPayments(res.data || []);
    } catch (error) {
      console.error("❌ Error fetching payments:", error);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          backgroundColor: "#0f172a",
          minHeight: "100vh",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "18px",
        }}
      >
        ⏳ Loading transactions...
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#0f172a",
        minHeight: "100vh",
        color: "white",
        padding: "50px",
      }}
    >
      <h1
        style={{
          marginBottom: "30px",
          fontSize: "36px",
          fontWeight: "bold",
          color: "#00d4ff",
          textTransform: "uppercase",
        }}
      >
        💳 PAYMENT HISTORY
      </h1>

      {payments.length === 0 ? (
        <div
          style={{
            backgroundColor: "#1a2a4a",
            padding: "50px",
            borderRadius: "10px",
            border: "2px solid #00d4ff",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "18px", color: "#aaa", marginBottom: "20px" }}>
            📭 No transactions yet
          </p>
          <a
            href="/create-service"
            style={{
              display: "inline-block",
              padding: "10px 20px",
              backgroundColor: "#00d4ff",
              color: "#000",
              textDecoration: "none",
              borderRadius: "5px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            ➕ Create Service
          </a>
        </div>
      ) : (
        <div>
          {/* SUMMARY CARDS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
              marginBottom: "40px",
            }}
          >
            {/* TOTAL AMOUNT */}
            <div
              style={{
                backgroundColor: "#1a2a4a",
                padding: "20px",
                borderRadius: "10px",
                border: "2px solid #00d4ff",
              }}
            >
              <p style={{ color: "#00d4ff", marginBottom: "10px", fontWeight: "bold" }}>
                💰 TOTAL AMOUNT
              </p>
              <h2 style={{ margin: "0", fontSize: "28px", color: "#00d4ff" }}>
                ₹{payments.reduce((sum, p) => sum + (p.amount || 0), 0)}
              </h2>
            </div>

            {/* COMPLETED */}
            <div
              style={{
                backgroundColor: "#1a2a4a",
                padding: "20px",
                borderRadius: "10px",
                border: "2px solid #28a745",
              }}
            >
              <p style={{ color: "#28a745", marginBottom: "10px", fontWeight: "bold" }}>
                ✅ COMPLETED
              </p>
              <h2 style={{ margin: "0", fontSize: "28px", color: "#28a745" }}>
                {payments.filter((p) => p.status === "completed").length}
              </h2>
            </div>

            {/* PENDING */}
            <div
              style={{
                backgroundColor: "#1a2a4a",
                padding: "20px",
                borderRadius: "10px",
                border: "2px solid #ffc107",
              }}
            >
              <p style={{ color: "#ffc107", marginBottom: "10px", fontWeight: "bold" }}>
                ⏳ PENDING
              </p>
              <h2 style={{ margin: "0", fontSize: "28px", color: "#ffc107" }}>
                {payments.filter((p) => p.status === "pending").length}
              </h2>
            </div>

            {/* REFUNDED */}
            <div
              style={{
                backgroundColor: "#1a2a4a",
                padding: "20px",
                borderRadius: "10px",
                border: "2px solid #ff6b35",
              }}
            >
              <p style={{ color: "#ff6b35", marginBottom: "10px", fontWeight: "bold" }}>
                🔄 REFUNDED
              </p>
              <h2 style={{ margin: "0", fontSize: "28px", color: "#ff6b35" }}>
                {payments.filter((p) => p.status === "refunded").length}
              </h2>
            </div>
          </div>

          {/* PAYMENTS TABLE */}
          <div
            style={{
              backgroundColor: "#1a2a4a",
              borderRadius: "10px",
              border: "2px solid #00d4ff",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr",
                backgroundColor: "rgba(0, 212, 255, 0.1)",
                padding: "15px",
                fontWeight: "bold",
                borderBottom: "2px solid #00d4ff",
                fontSize: "13px",
                textTransform: "uppercase",
              }}
            >
              <div>Order ID</div>
              <div>Amount</div>
              <div>Status</div>
              <div>Date</div>
              <div>Service</div>
              <div>Action</div>
            </div>

            {/* PAYMENTS LIST */}
            {payments.map((payment, index) => (
              <div
                key={payment._id || index}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr",
                  padding: "15px",
                  borderBottom: "1px solid #333",
                  alignItems: "center",
                  fontSize: "13px",
                  transition: "background-color 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(0, 212, 255, 0.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {/* ORDER ID */}
                <div
                  style={{
                    color: "#00d4ff",
                    fontWeight: "bold",
                    wordBreak: "break-all",
                    fontSize: "11px",
                  }}
                >
                  {payment.orderId?.substring(0, 12)}...
                </div>

                {/* AMOUNT */}
                <div style={{ color: "#00d4ff", fontWeight: "bold", fontSize: "14px" }}>
                  ₹{payment.amount}
                </div>

                {/* STATUS */}
                <div
                  style={{
                    padding: "5px 10px",
                    borderRadius: "5px",
                    fontWeight: "bold",
                    display: "inline-block",
                    textAlign: "center",
                    backgroundColor:
                      payment.status === "completed"
                        ? "rgba(40, 167, 69, 0.2)"
                        : payment.status === "pending"
                        ? "rgba(255, 193, 7, 0.2)"
                        : "rgba(255, 107, 53, 0.2)",
                    color:
                      payment.status === "completed"
                        ? "#28a745"
                        : payment.status === "pending"
                        ? "#ffc107"
                        : "#ff6b35",
                  }}
                >
                  {payment.status === "completed" && "✅ Completed"}
                  {payment.status === "pending" && "⏳ Pending"}
                  {payment.status === "refunded" && "🔄 Refunded"}
                </div>

                {/* DATE */}
                <div style={{ color: "#aaa", fontSize: "12px" }}>
                  {new Date(payment.createdAt).toLocaleDateString()}
                </div>

                {/* SERVICE */}
                <div style={{ color: "#aaa", fontSize: "12px", maxWidth: "150px", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {payment.jobId?.title || "Service"}
                </div>

                {/* ACTION */}
                <div>
                  <button
                    onClick={() => {
                      alert(
                        `Order Details:\n\nOrder ID: ${payment.orderId}\nAmount: ₹${payment.amount}\nStatus: ${payment.status}\nDate: ${new Date(payment.createdAt).toLocaleString()}`
                      );
                    }}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#00d4ff",
                      color: "#000",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "12px",
                      transition: "all 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#00b8d4";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "#00d4ff";
                    }}
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;