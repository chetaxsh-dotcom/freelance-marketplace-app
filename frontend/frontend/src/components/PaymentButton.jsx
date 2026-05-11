import API from "../api/api";

const PaymentButton = ({ amount, jobId, freelancerId }) => {

  const handlePayment = async () => {
    try {
      const clientId = localStorage.getItem("userId");

      //  CREATE ORDER
      const { data } = await API.post("/payments/create-order", {
        amount,
        jobId,
        freelancerId,
        clientId,
        description: "Freelance Payment"
      });

      const { order, keyId } = data;

      //  RAZORPAY OPTIONS
      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Freelance Marketplace",
        description: "Payment for service",
        order_id: order.id,

        handler: async function (response) {
          try {
            //  VERIFY PAYMENT
             console.log("VERIFY DATA:", response); // DEBUG

            await API.post("/payments/verify", {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            });

            alert("✅ Payment Successful");
            window.location.href = "/payments";

          } catch (err) {
          console.error("VERIFY ERROR:", err.response?.data || err);
          alert("❌ Verification Failed (Check Backend)");      
          }
        },

        prefill: {
          name: "User",
          email: "user@email.com"
        },

        theme: {
          color: "#6366f1"
        }
      };

      //  OPEN RAZORPAY
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      alert("❌ Payment Failed");
    }
  };

  return (
    <button
      onClick={handlePayment}
      style={{
        padding: "10px",
        background: "#28a745",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        width: "100%",
        fontWeight: "bold"
      }}
    >
      💳 Pay Now
    </button>
  );
};

export default PaymentButton;