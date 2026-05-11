import { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import PaymentButton from "../components/PaymentButton";
import HoverButton from "../components/HoverButton";

const Home = () => {
  const [services, setServices] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [maxPrice, setMaxPrice] = useState("");
  const [location, setLocation] = useState("");
  const [minRating, setMinRating] = useState("");
  const [skill, setSkill] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await API.get("/services");
      setServices(res.data);
      setFiltered(res.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  //  APPLY FILTERS (MAIN LOGIC)
  const applyFilters = () => {
    let result = [...services];

    // SEARCH
    if (search) {
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(search.toLowerCase()) ||
          item.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // CATEGORY
    if (category !== "all") {
  result = result.filter((item) =>
    item.title.toLowerCase().includes(category.toLowerCase()) ||
    item.category?.toLowerCase().includes(category.toLowerCase())
  );
}

    // PRICE
    if (maxPrice) {
      result = result.filter((item) => item.price <= Number(maxPrice));
    }

    // LOCATION
if (location) {
  result = result.filter(item =>
    item.location?.toLowerCase().includes(location.toLowerCase())
  );
}

// RATING
if (minRating) {
  result = result.filter(
    item => item.averageRating >= Number(minRating)
  );
}

// SKILLS
if (skill) {
  result = result.filter(item =>
    item.skills?.some(s =>
      s.toLowerCase().includes(skill.toLowerCase())
    )
  );
}

    setFiltered(result);
  };

  return (
    <div style={{ padding: "20px", background: "#f4f6f9" }}>
      <h1 style={{ marginBottom: "20px" }}> Freelance Marketplace</h1>

      {/* 🔍 SEARCH + FILTER BAR */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          flex: "wrap",
          marginBottom: "20px",
        }}
      >
        {/* SEARCH INPUT */}
        <input
          type="text"
          placeholder="Search services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 2,
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />

        {/* CATEGORY */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: "12px", borderRadius: "8px" }}
        >
          <option value="all">All</option>
          <option value="web">Web</option>
          <option value="design">Design</option>
          <option value="data">Data</option>
        </select>

        {/* PRICE */}
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          style={{ padding: "12px", borderRadius: "8px" }}
        />

           <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #ccc"
                  }}
        />

        <input
          type="number"
          placeholder="Min Rating"
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc"
            }}
        />

        <input
          type="text"
          placeholder="Skill"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc"
             }}
        />

        {/* APPLY */}
        <button
          onClick={applyFilters}
          style={{
            padding: "12px 20px",
            background: "#6366f1",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Search
        </button>

        {/* CLEAR */}
        <button
          onClick={() => {
            setSearch("");
            setCategory("all");
            setMaxPrice("");
            setFiltered(services);
          }}
          style={{
            padding: "12px 20px",
            background: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Clear
        </button>
      </div>

      {/* 🧱 CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {filtered.map((item) => (
          <div
            key={item._id}
            style={{
              background: "white",
              padding: "15px",
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <img
              src={item.image || "https://picsum.photos/300/150"}
              alt={item.title}
              style={{
                width: "100%",
                height: "150px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />

            <h3 style={{ marginTop: "10px" }}>{item.title}</h3>

            <p style={{ fontSize: "14px", color: "#555" }}>
              {item.description?.substring(0, 80)}...
            </p>

            <p style={{ fontWeight: "bold", color: "#16a34a" }}>
              ₹{item.price}
            </p>

            <p style={{ color: "#f59e0b" }}>
              ⭐{" "}
              {item.averageRating
                ? item.averageRating.toFixed(1)
                : "No ratings"}
            </p>

            <p style={{ fontSize: "15px", fontWeight: "bold", color: "#666" }}>
              📂 {item.category}
            </p>

            <p style={{ fontSize: "15px",fontWeight: "bold", color: "#666" }}>
              📍 {item.location || "N/A"}
            </p>

            <p style={{ fontSize: "15px", fontWeight: "bold",  color: "#666" }}>
              🛠 {item.skills?.join(", ") || "N/A"}
            </p>

               <div style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
              gap: "10px"
              
            
            }}>
              <button
                onClick={() => navigate(`/services/${item._id}`)}
                style={{
                  padding: "9px 12px",
                  background: "#8b5cf6",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                ⭐ View & Reviews
              </button>

              <button
  onClick={() => navigate(`/hire/${item._id}`)}
  style={{
    
    padding: "9px 12px",
    background: "#9016a3c9",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "10px",
    width: "150px"
  }}
>
  💼 Hire Now
</button>

            </div>
            

              
              <PaymentButton
                amount={item.price}
                jobId={item._id}
                freelancerId={item.freelancerId || "unknown"}
              />
            </div>
          
        ))}
      </div>

      {/* EMPTY */}
      {filtered.length === 0 && (
        <p style={{ textAlign: "center", marginTop: "30px" }}>
          No services found ....
        </p>
      )}
    </div>
  );
};

export default Home;