import { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import PaymentButton from "../components/PaymentButton";

const Home = () => {
  const [services, setServices] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterPrice, setFilterPrice] = useState("all");
  const [filterRating, setFilterRating] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, filterCategory, filterPrice, filterRating, filterLocation, services]);

  const fetchServices = async () => {
    try {
      console.log("📋 Fetching services...");
      const res = await API.get("/services");
      console.log("✅ Services fetched:", res.data);
      setServices(res.data || []);
      
      // Extract unique locations
      const uniqueLocations = [...new Set(res.data?.map(s => s.location).filter(Boolean))];
      setLocations(uniqueLocations);
    } catch (error) {
      console.error("❌ Error fetching services:", error);
      setServices([]);
    }
  };

  const applyFilters = () => {
    let result = services;

    // Search filter
    if (search) {
      result = result.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Category filter
    if (filterCategory !== "all") {
      result = result.filter((item) => item.category === filterCategory);
    }

    // Price filter (UPDATED)
    if (filterPrice !== "all") {
      if (filterPrice === "0-2000") result = result.filter((item) => item.price <= 2000);
      if (filterPrice === "2000-5000") result = result.filter((item) => item.price > 2000 && item.price <= 5000);
      if (filterPrice === "5000-10000") result = result.filter((item) => item.price > 5000 && item.price <= 10000);
      if (filterPrice === "10000+") result = result.filter((item) => item.price > 10000);
    }

    // Rating filter
    if (filterRating !== "all") {
      result = result.filter((item) => (item.averageRating || 0) >= parseInt(filterRating));
    }

    // Location filter (NEW)
    if (filterLocation !== "all") {
      result = result.filter((item) => item.location === filterLocation);
    }

    setFiltered(result);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>🎯 Freelance Marketplace</h1>

      {/* SEARCH BAR */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="🔍 Search services..."
          value={search}
          onChange={handleSearch}
          style={{
            width: "100%",
            padding: "12px",
            fontSize: "16px",
            borderRadius: "5px",
            border: "1px solid #ddd",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
          }}
        />
      </div>

      {/* FILTERS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "15px",
        marginBottom: "30px",
        backgroundColor: "white",
        padding: "15px",
        borderRadius: "8px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
      }}>
        {/* Category Filter */}
        <div>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>
            📁 Category
          </label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              fontSize: "14px"
            }}
          >
            <option value="all">All Categories</option>
            <option value="web-development">Web Development</option>
            <option value="graphic-design">Graphic Design</option>
            <option value="writing">Writing</option>
            <option value="digital-marketing">Digital Marketing</option>
            <option value="video-editing">Video Editing</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Price Filter (UPDATED) */}
        <div>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>
            💰 Price Range
          </label>
          <select
            value={filterPrice}
            onChange={(e) => setFilterPrice(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              fontSize: "14px"
            }}
          >
            <option value="all">All Prices</option>
            <option value="0-2000">₹0 - ₹2,000 (Budget)</option>
            <option value="2000-5000">₹2,000 - ₹5,000 (Standard)</option>
            <option value="5000-10000">₹5,000 - ₹10,000 (Premium)</option>
            <option value="10000+">₹10,000+ (Luxury)</option>
          </select>
        </div>

        {/* Location Filter (NEW) */}
        <div>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>
            📍 Location
          </label>
          <select
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              fontSize: "14px"
            }}
          >
            <option value="all">All Locations</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                📍 {location}
              </option>
            ))}
          </select>
        </div>

        {/* Rating Filter */}
        <div>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>
            ⭐ Minimum Rating
          </label>
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              fontSize: "14px"
            }}
          >
            <option value="all">All Ratings</option>
            <option value="1">1+ Stars ⭐</option>
            <option value="2">2+ Stars ⭐⭐</option>
            <option value="3">3+ Stars ⭐⭐⭐</option>
            <option value="4">4+ Stars ⭐⭐⭐⭐</option>
            <option value="5">5 Stars ⭐⭐⭐⭐⭐</option>
          </select>
        </div>

        {/* CLEAR FILTERS BUTTON */}
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <button
            onClick={() => {
              setSearch("");
              setFilterCategory("all");
              setFilterPrice("all");
              setFilterLocation("all");
              setFilterRating("all");
            }}
            style={{
              width: "100%",
              padding: "8px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontSize: "14px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "background-color 0.3s"
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = "#5a6268"}
            onMouseLeave={(e) => e.target.style.backgroundColor = "#6c757d"}
          >
            🔄 Clear All
          </button>
        </div>
      </div>

      {/* ACTIVE FILTERS DISPLAY */}
      {(search || filterCategory !== "all" || filterPrice !== "all" || filterLocation !== "all" || filterRating !== "all") && (
        <div style={{
          marginBottom: "20px",
          padding: "10px 15px",
          backgroundColor: "#e7f3ff",
          borderRadius: "5px",
          fontSize: "14px",
          color: "#0066cc"
        }}>
          <strong>🔍 Filters Applied:</strong>
          {search && <span> Search: "{search}" |</span>}
          {filterCategory !== "all" && <span> Category: {filterCategory} |</span>}
          {filterPrice !== "all" && <span> Price: {filterPrice} |</span>}
          {filterLocation !== "all" && <span> Location: {filterLocation} |</span>}
          {filterRating !== "all" && <span> Rating: {filterRating}+ stars |</span>}
          <br />
          <small>Showing {filtered.length} result{filtered.length !== 1 ? 's' : ''}</small>
        </div>
      )}

      {/* NO SERVICES MESSAGE */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p style={{ fontSize: "18px", color: "#666", marginBottom: "20px" }}>
            📭 No services found matching your filters.
          </p>
          <a href="/create-service" style={{
            display: 'inline-block',
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            borderRadius: '5px',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}>
            ➕ Create First Service
          </a>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "20px",
        }}>
          {filtered.map((item) => {
            const freelancerId = item.freelancerId?._id || item.freelancerId;
            const freelancerName = item.freelancerId?.name || "Freelancer";

            return (
              <div
                key={item._id}
                style={{
                  border: "1px solid #ccc",
                  padding: "15px",
                  borderRadius: "8px",
                  backgroundColor: "white",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  transition: "transform 0.3s, boxShadow 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 5px 15px rgba(0,0,0,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                }}
              >
                {/* IMAGE */}
                <img
                  src={item.image || "https://via.placeholder.com/300x150"}
                  alt={item.title}
                  width="100%"
                  height="180"
                  style={{
                    borderRadius: "5px",
                    objectFit: "cover",
                    marginBottom: "10px"
                  }}
                />

                {/* TITLE */}
                <h3 style={{ marginTop: "10px", marginBottom: "8px", fontSize: "18px" }}>
                  {item.title}
                </h3>

                {/* DESCRIPTION */}
                <p style={{
                  color: "#666",
                  fontSize: "14px",
                  marginBottom: "10px",
                  minHeight: "40px"
                }}>
                  {item.description?.substring(0, 100)}...
                </p>

                {/* CATEGORY, LOCATION & PRICE */}
                <div style={{
                  display: "flex",
                  gap: "8px",
                  marginBottom: "10px",
                  fontSize: "12px",
                  flexWrap: "wrap"
                }}>
                  <span style={{
                    backgroundColor: "#e3f2fd",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontWeight: "bold"
                  }}>
                    📁 {item.category}
                  </span>
                  {item.location && (
                    <span style={{
                      backgroundColor: "#f3e5f5",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontWeight: "bold"
                    }}>
                      📍 {item.location}
                    </span>
                  )}
                  <span style={{
                    backgroundColor: "#e8f5e9",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontWeight: "bold",
                    color: "#28a745"
                  }}>
                    💰 ₹{item.price}
                  </span>
                </div>

                {/* SKILLS */}
                {item.skills && (
                  <p style={{
                    fontSize: "12px",
                    color: "#555",
                    marginBottom: "10px",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "5px"
                  }}>
                    {Array.isArray(item.skills)
                      ? item.skills.map((skill) => (
                          <span
                            key={skill}
                            style={{
                              backgroundColor: "#fff3cd",
                              padding: "3px 8px",
                              borderRadius: "12px",
                              fontSize: "11px"
                            }}
                          >
                            🛠 {skill}
                          </span>
                        ))
                      : typeof item.skills === "string"
                      ? item.skills.split(",").map((skill) => (
                          <span
                            key={skill}
                            style={{
                              backgroundColor: "#fff3cd",
                              padding: "3px 8px",
                              borderRadius: "12px",
                              fontSize: "11px"
                            }}
                          >
                            🛠 {skill.trim()}
                          </span>
                        ))
                      : null}
                  </p>
                )}

                {/* RATING & FREELANCER */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "10px",
                  borderTop: "1px solid #eee",
                  paddingTop: "10px"
                }}>
                  <p style={{
                    color: "#ffc107",
                    fontSize: "14px",
                    fontWeight: "bold"
                  }}>
                    ⭐ {item.averageRating?.toFixed(1) || "0"} / 5
                  </p>
                  {freelancerId && (
                    <p style={{
                      fontSize: "12px",
                      color: "#666",
                      backgroundColor: "#f9f9f9",
                      padding: "4px 8px",
                      borderRadius: "4px"
                    }}>
                      👤 {freelancerName}
                    </p>
                  )}
                </div>

                {/* ACTION BUTTONS */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                  marginBottom: "10px"
                }}>
                  {/* VIEW DETAILS */}
                  <button
                    onClick={() => navigate(`/services/${item._id}`)}
                    style={{
                      padding: "10px",
                      backgroundColor: "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "14px",
                      transition: "background-color 0.3s"
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = "#0056b3"}
                    onMouseLeave={(e) => e.target.style.backgroundColor = "#007bff"}
                  >
                    👉 View
                  </button>

                  {/* HIRE NOW */}
                  <button
                    onClick={() => navigate(`/hire/${item._id}`)}
                    style={{
                      padding: "10px",
                      backgroundColor: "#ff9800",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "14px",
                      transition: "background-color 0.3s"
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = "#f57c00"}
                    onMouseLeave={(e) => e.target.style.backgroundColor = "#ff9800"}
                  >
                    💼 Hire
                  </button>
                </div>

                {/* PAY NOW - Full width */}
                {freelancerId ? (
                  <PaymentButton
                    amount={item.price}
                    jobId={item._id}
                    freelancerId={freelancerId}
                    serviceName={item.title}
                  />
                ) : (
                  <button
                    disabled
                    style={{
                      width: '100%',
                      padding: '10px',
                      backgroundColor: '#ccc',
                      color: '#999',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'not-allowed',
                      fontWeight: 'bold'
                    }}
                  >
                    ⚠️ Freelancer Info Missing
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Home;