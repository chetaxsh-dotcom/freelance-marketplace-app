import { useState } from "react";

const HoverButton = ({ text, onClick, bg = "#007bff" }) => {
  const [hover, setHover] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: "10px",
        backgroundColor: hover ? "#0056b3" : bg,
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontWeight: "bold",
        transition: "0.3s",
        transform: hover ? "scale(1.05)" : "scale(1)"
      }}
    >
      {text}
    </button>
  );
};

export default HoverButton;