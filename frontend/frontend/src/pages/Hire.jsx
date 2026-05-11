import { useParams } from "react-router-dom";
import { useState } from "react";
import API from "../api/api";

const Hire = () => {

  const { id } = useParams();

  const [amount, setAmount] = useState("");
  const [proposal, setProposal] = useState("");

  const handleHire = async () => {

    try {

      await API.post("/contracts", {
        serviceId: id,
        amount,
        proposal,
        status: "active"
      });

      alert("✅ Freelancer Hired");

    } catch (err) {
      console.log(err);
      alert("❌ Failed");
    }
  };

  return (
    <div style={{ padding: "30px" }}>

      <h1>💼 Hire Freelancer</h1>

      <textarea
        placeholder="Write proposal..."
        value={proposal}
        onChange={(e) => setProposal(e.target.value)}
        style={{
          width: "100%",
          height: "120px",
          marginTop: "20px"
        }}
      />

      <input
        type="number"
        placeholder="Budget"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "20px"
        }}
      />

      <button
        onClick={handleHire}
        style={{
          marginTop: "20px",
          padding: "12px 20px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "8px"
        }}
      >
        Send Contract
      </button>

    </div>
  );
};

export default Hire;