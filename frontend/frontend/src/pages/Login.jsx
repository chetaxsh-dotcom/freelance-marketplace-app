import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('🔐 Login attempt with:', email);
      
      const res = await API.post("/auth/login", { email, password });

      console.log('✅ Login response:', res.data);

      //  SAVE TO LOCALSTORAGE
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user._id);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      //  VERIFY SAVED
      console.log('📦 Saved to localStorage:', {
        token: localStorage.getItem("token"),
        userId: localStorage.getItem("userId"),
        role: localStorage.getItem("role"),
        user: localStorage.getItem("user")
      });

      alert("Login Successful ✅");
      navigate("/");

    } catch (err) {
      console.error('❌ Login Error:', err.response?.data || err);
      alert("Login Failed ❌: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay}></div>

      <div style={styles.card}>
        <h1 style={styles.title}>Sign In</h1>

        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />

          <button 
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: loading ? "#999999" : (hover ? "#11a51dcf" : "#3da51196"),
              color: "white",
              padding: "8px 15px",
              borderRadius: "5px",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "0.3s",
              boxShadow: hover ? "0 4px 12px rgba(0,0,0,0.3)" : "none",
              fontWeight: "bold"
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "15px", fontSize: "14px" }}>
          Don't have an account?{" "}
          <a href="/signup" style={{ color: "#3da51196", cursor: "pointer" }}>
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage:
      "url('https://plus.unsplash.com/premium_photo-1723773736797-8d05f469c6df?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fGNvbGxhYm9yYXRpb258ZW58MHx8MHx8fDA%3D')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
  },

  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.6)",
  },

  card: {
    position: "relative",
    zIndex: 2,
    width: "350px",
    padding: "40px",
    backgroundColor: "rgba(0,0,0,0.75)",
    borderRadius: "10px",
    color: "white",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 8px 32px rgba(0,0,0,0.7)",
  },

  title: {
    marginBottom: "20px",
    textAlign: "center",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  input: {
    padding: "12px",
    borderRadius: "5px",
    border: "none",
    outline: "none",
    fontSize: "14px",
  },
};