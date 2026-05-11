import { useState, useEffect } from "react";
import API from "../api/api";

const Profile = () => {

  const [user, setUser] = useState(null);

  // PASSWORD
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // PROFILE
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [portfolio, setPortfolio] = useState("");

  useEffect(() => {

    const userData = JSON.parse(localStorage.getItem("user"));

    setUser(userData);

    // OLD DATA LOAD
    if (userData) {
      setBio(userData.bio || "");
      setSkills(userData.skills?.join(", ") || "");
      setPortfolio(userData.portfolio?.join(", ") || "");
    }

  }, []);

  // UPDATE PASSWORD
  const handlePasswordUpdate = async () => {

    try {

      await API.patch("/auth/change-password", {
        userId: user._id,
        oldPassword,
        newPassword
      });

      alert("✅ Password Updated");

      setOldPassword("");
      setNewPassword("");

    } catch (err) {

      console.log(err.response?.data || err);

      alert(err.response?.data?.message || "Failed");
    }
  };

  // UPDATE PROFILE
  const handleProfileUpdate = async () => {

    try {

      const updatedData = {
        bio,
        skills: skills.split(","),
        portfolio: portfolio.split(",")
      };

      const res = await API.patch(
        `/users/${user._id}`,
        updatedData
      );

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          ...updatedData
        })
      );

      alert("✅ Profile Updated");

    } catch (err) {

      console.log(err);

      alert("❌ Failed to update profile");
    }
  };

  // LOGOUT
  const handleLogout = () => {

    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");

    window.location.href = "/";
  };

  if (!user) {
    return (
      <p style={{ padding: "20px" }}>
        Please login first
      </p>
    );
  }

  return (

    <div
      style={{
        maxWidth: "700px",
        margin: "30px auto",
        padding: "20px"
      }}
    >

      <h1>👤 My Profile</h1>

      {/* PROFILE CARD */}
      <div
        style={{
          border: "1px solid #ddd",
          padding: "25px",
          borderRadius: "12px",
          backgroundColor: "#f9f9f9",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
        }}
      >

        {/* BASIC INFO */}

        <p>
          <strong>Name:</strong> {user.name}
        </p>

        <p>
          <strong>Email:</strong> {user.email}
        </p>

        <p>
          <strong>Role:</strong> {user.role}
        </p>

        {/* BIO */}

        <h3 style={{ marginTop: "25px" }}>
          📝 Bio
        </h3>

        <textarea
          placeholder="Write about yourself..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          style={{
            width: "100%",
            minHeight: "100px",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc"
          }}
        />

        {/* SKILLS */}

        <h3 style={{ marginTop: "20px" }}>
          🛠 Skills
        </h3>

        <input
          type="text"
          placeholder="React, Node, MongoDB"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          style={inputStyle}
        />

        {/* PORTFOLIO */}

        <h3 style={{ marginTop: "20px" }}>
          🌐 Portfolio Links
        </h3>

        <input
          type="text"
          placeholder="Github, Linkedin, Portfolio URL"
          value={portfolio}
          onChange={(e) => setPortfolio(e.target.value)}
          style={inputStyle}
        />

        {/* UPDATE PROFILE BTN */}

        <button
          onClick={handleProfileUpdate}
          style={blueBtn}
        >
          💾 Save Profile
        </button>

        {/* PASSWORD SECTION */}

        <h2 style={{ marginTop: "35px" }}>
          🔒 Change Password
        </h2>

        <input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) =>
            setOldPassword(e.target.value)
          }
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) =>
            setNewPassword(e.target.value)
          }
          style={inputStyle}
        />

        <button
          onClick={handlePasswordUpdate}
          style={greenBtn}
        >
          🔑 Update Password
        </button>

        {/* LOGOUT */}

        <button
          onClick={handleLogout}
          style={logoutBtn}
        >
          🚪 Logout
        </button>

      </div>
    </div>
  );
};

// INPUT STYLE
const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  marginTop: "10px"
};

// BUTTONS
const blueBtn = {
  marginTop: "20px",
  padding: "12px 20px",
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  width: "100%",
  fontWeight: "bold"
};

const greenBtn = {
  marginTop: "15px",
  padding: "12px 20px",
  backgroundColor: "#16a34a",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  width: "100%",
  fontWeight: "bold"
};

const logoutBtn = {
  marginTop: "20px",
  padding: "12px 20px",
  backgroundColor: "#dc2626",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  width: "100%",
  fontWeight: "bold"
};

export default Profile;