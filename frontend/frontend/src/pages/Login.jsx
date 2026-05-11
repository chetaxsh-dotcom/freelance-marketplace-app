import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);


  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user._id);

      alert("Login Successful ✅");
      navigate("/"); // redirect to home

    } catch (err) {
      console.error(err);
      alert("Login Failed ❌");
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
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          <button 
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          type="submit" 
          style={{
            backgroundColor: hover ? "#11a51dcf" : "#3da51196",
            color: "white",
            padding: "8px 15px",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
            transition: "0.3s",
            boxShadow: hover ? "0 4px 12px rgba(0,0,0,0.3)" : "none"            
          }
          }>
            Login
          </button>
        </form>
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
    boxShadow:
      "0 8px 32px rgba(0,0,0,0.7)",
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

  button: {
    padding: "12px",
    backgroundColor: "#e50914",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    cursor: "pointer",
    hover:""
  },
};