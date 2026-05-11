import { useState } from "react";
import API from "../api/api";

function Register() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hover, setHover] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await API.post("/auth/register", {
        name,
        email,
        password
      });

      console.log(res.data);

      alert("✅ User Registered");

      setName("");
      setEmail("");
      setPassword("");

    } catch (error) {

      console.log(error);

      alert("❌ Registration Failed");
    }
  };

  return (

    <div style={styles.container}>

      {/* DARK OVERLAY */}
      <div style={styles.overlay}></div>

      {/* REGISTER CARD */}
      <div style={styles.card}>

        <h1 style={styles.heading}>
          Create Account
        </h1>

        <p style={styles.subHeading}>
          Join Freelance Marketplace
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            style={styles.input}
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            style={styles.input}
          />

          <button
            type="submit"

            onMouseEnter={() =>
              setHover(true)
            }

            onMouseLeave={() =>
              setHover(false)
            }

            style={{
              ...styles.button,

              background: hover
                ? "#2563eb"
                : "#1d4ed8",

              transform: hover
                ? "scale(1.03)"
                : "scale(1)"
            }}
          >
            Register
          </button>

        </form>

      </div>

    </div>
  );
}

export default Register;


const styles = {

  container: {

    height: "100vh",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    backgroundImage:
      "url('https://images.unsplash.com/photo-1771387925687-b300710145cd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDM4fHRvd0paRnNrcEdnfHxlbnwwfHx8fHw%3D')",

    backgroundSize: "cover",

    backgroundPosition: "center",

    position: "relative"
  },

  overlay: {

    position: "absolute",

    top: 0,
    left: 0,

    width: "100%",
    height: "100%",

    background:
      "rgba(0,0,0,0.55)"
  },

  card: {

    position: "relative",

    zIndex: 3,

    width: "380px",

    padding: "40px",

    borderRadius: "16px",

    backdropFilter: "blur(10px)",

    backgroundcolor:
      "rgba(255,255,255,0.10)",

    border:
      "1px solid rgba(255,255,255,0.2)",

    boxShadow:
      "0 8px 32px rgba(0,0,0,0.5)",

    display: "flex",

    flexDirection: "column"
  },

  heading: {

    color: "#fff",

    marginBottom: "5px",

    textAlign: "center"
  },

  subHeading: {

    color: "#ddd",

    marginBottom: "25px",

    textAlign: "center"
  },

  input: {

    width: "100%",

    padding: "12px",

    marginBottom: "15px",

    borderRadius: "8px",

    border: "none",

    outline: "none",

    fontSize: "15px"
  },

  button: {

    width: "100%",

    padding: "12px",

    color: "#fff",

    border: "none",

    borderRadius: "8px",

    cursor: "pointer",

    fontWeight: "bold",

    fontSize: "16px",

    transition: "0.3s"
  }
};