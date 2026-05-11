import { useState } from "react";
import API from "../api/api";

const ForgotPassword = () => {

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] =
    useState("");

  const handleReset = async () => {

    try {

      await API.patch(
        "/auth/forgot-password",
        {
          email,
          newPassword
        }
      );

      alert("✅ Password Reset Successful");

    } catch (err) {

      console.log(err);

      alert("❌ Reset Failed");
    }
  };

  return (

    <div style={{ padding: "30px" }}>

      <h1>🔑 Forgot Password</h1>

      <input
        placeholder="Enter Email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <br /><br />

      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) =>
          setNewPassword(e.target.value)
        }
      />

      <br /><br />

      <button onClick={handleReset}>
        Reset Password
      </button>

    </div>
  );
};

export default ForgotPassword;