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
      const res = await API.get("/services");
      setServices(res.data || []);
      const uniqueLocations = [...new Set(res.data?.map(s => s.location).filter(Boolean))];
      setLocations(uniqueLocations);
    } catch (error) {
      console.error("Error:", error);
      setServices([]);
    }
  };

  const applyFilters = () => {
    let result = services;

    if (search) {
      result = result.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filterCategory !== "all") {
      result = result.filter((item) => item.category === filterCategory);
    }

    if (filterPrice !== "all") {
      if (filterPrice === "0-2000") result = result.filter((item) => item.price <= 2000);
      if (filterPrice === "2000-5000") result = result.filter((item) => item.price > 2000 && item.price <= 5000);
      if (filterPrice === "5000-10000") result = result.filter((item) => item.price > 5000 && item.price <= 10000);
      if (filterPrice === "10000+") result = result.filter((item) => item.price > 10000);
    }

    if (filterRating !== "all") {
      result = result.filter((item) => (item.averageRating || 0) >= parseInt(filterRating));
    }

    if (filterLocation !== "all") {
      result = result.filter((item) => item.location === filterLocation);
    }

    setFiltered(result);
  };

  return (
    <div style={{ backgroundColor: "#0f172a", minHeight: "100vh", color: "white" }}>
      {/* HERO SECTION */}
      <div
        style={{
          background: "linear-gradient(135deg, #1a2a4a 0%, #0f172a 100%)",
          padding: "60px 50px",
          textAlign: "center",
          borderBottom: "2px solid #00d4ff"
        }}
      >
        <h1 style={{
          fontSize: "48px",
          fontWeight: "900",
          marginBottom: "15px",
          color: "#00d4ff",
          textTransform: "uppercase",
          letterSpacing: "2px"
        }}>
          DISCOVER FREELANCE TALENT
        </h1>
        <p style={{
          fontSize: "16px",
          color: "#aaa",
          marginBottom: "30px"
        }}>
          Find the perfect freelancer for your project. Browse thousands of skilled professionals.
        </p>

        {/* SEARCH BAR */}
        <div style={{ maxWidth: "700px", margin: "0 auto", marginBottom: "30px" }}>
          <div style={{
            display: "flex",
            gap: "10px",
            backgroundColor: "#0f172a",
            padding: "12px 20px",
            borderRadius: "8px",
            border: "2px solid #00d4ff",
            transition: "all 0.3s"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 0 20px rgba(0, 212, 255, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "none";
          }}
          >
            <span style={{ fontSize: "18px" }}>🔍</span>
            <input
              type="text"
              placeholder="Search services, skills, freelancers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1,
                backgroundColor: "transparent",
                border: "none",
                color: "white",
                fontSize: "14px",
                outline: "none"
              }}
            />
          </div>
        </div>

        {/* DEMO CREDENTIALS */}
        <div style={{
          backgroundColor: "rgba(0, 212, 255, 0.1)",
          padding: "15px 25px",
          borderRadius: "8px",
          border: "2px solid #00d4ff",
          maxWidth: "600px",
          margin: "0 auto",
          fontSize: "12px"
        }}>
          <p style={{
            margin: "0 0 10px 0",
            fontWeight: "bold",
            color: "#00d4ff",
            textTransform: "uppercase"
          }}>
            📌 DEMO CREDENTIALS:
          </p>
          <p style={{
            margin: "5px 0",
            color: "#00d4ff"
          }}>
            🎨 Freelancer: <code>freelancer@gmail.com / password123</code>
          </p>
          <p style={{
            margin: "5px 0",
            color: "#00d4ff"
          }}>
            💼 Client: <code>client@gmail.com / password123</code>
          </p>
        </div>
      </div>

      {/* FILTERS SECTION */}
      <div style={{
        padding: "30px 50px",
        backgroundColor: "#0f172a",
        borderBottom: "2px solid #333"
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "15px",
          marginBottom: "20px"
        }}>
          {/* CATEGORY */}
          <div>
            <label style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "bold",
              color: "#00d4ff",
              fontSize: "12px",
              textTransform: "uppercase"
            }}>
              📁 CATEGORY
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#1a2a4a",
                border: "2px solid #00d4ff",
                color: "#00d4ff",
                borderRadius: "5px",
                fontSize: "12px",
                fontWeight: "bold",
                cursor: "pointer"
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

          {/* PRICE */}
          <div>
            <label style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "bold",
              color: "#ff6b35",
              fontSize: "12px",
              textTransform: "uppercase"
            }}>
              💰 PRICE RANGE
            </label>
            <select
              value={filterPrice}
              onChange={(e) => setFilterPrice(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#1a2a4a",
                border: "2px solid #ff6b35",
                color: "#ff6b35",
                borderRadius: "5px",
                fontSize: "12px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              <option value="all">All Prices</option>
              <option value="0-2000">₹0 - ₹2,000</option>
              <option value="2000-5000">₹2,000 - ₹5,000</option>
              <option value="5000-10000">₹5,000 - ₹10,000</option>
              <option value="10000+">₹10,000+</option>
            </select>
          </div>

          {/* LOCATION - WITH SEARCH */}
          
          <div>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "bold",
              color: "#ff4444",
              fontSize: "12px",
              textTransform: "uppercase",
            }}
          >
            📍 LOCATION
          </label>

          <select
            value={filterLocation}
            onChange={(e) => {
              const value = e.target.value;
              console.log('📍 Location selected:', value);
              setFilterLocation(value);
            }}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#1a2a4a",
              border: "2px solid #ff4444",
              color: "#ff4444",
              borderRadius: "5px",
              fontSize: "12px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            <option value="all">📍 All Locations</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                📍 {location}
              </option>
            ))}
          </select>
        </div>

        

          {/* RATING */}
          <div>
            <label style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "bold",
              color: "#ffc107",
              fontSize: "12px",
              textTransform: "uppercase"
            }}>
              ⭐ RATING
            </label>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#1a2a4a",
                border: "2px solid #ffc107",
                color: "#ffc107",
                borderRadius: "5px",
                fontSize: "12px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              <option value="all">All Ratings</option>
              <option value="1">1+ Stars</option>
              <option value="2">2+ Stars</option>
              <option value="3">3+ Stars</option>
              <option value="4">4+ Stars</option>
              <option value="5">5 Stars</option>
            </select>
          </div>

          {/* CLEAR BUTTON */}
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
                padding: "10px",
                backgroundColor: "#1a2a4a",
                color: "#00d4ff",
                border: "2px solid #00d4ff",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "12px",
                textTransform: "uppercase",
                transition: "all 0.3s"
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#00d4ff";
                e.target.style.color = "#000";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#1a2a4a";
                e.target.style.color = "#00d4ff";
              }}
            >
              🔄 CLEAR ALL
            </button>
          </div>
        </div>

        {/* RESULTS INFO */}
        <div style={{ fontSize: "12px", color: "#00d4ff", fontWeight: "bold" }}>
          Showing <strong>{filtered.length}</strong> result{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* SERVICES GRID */}
      <div style={{ padding: "50px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <h2 style={{ color: "#aaa", marginBottom: "20px" }}>📭 No services found</h2>
            <p style={{ color: "#666" }}>Try adjusting your filters</p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "25px"
          }}>
            {filtered.map(item => {
              const freelancerId = item.freelancerId?._id || item.freelancerId;
              const freelancerName = item.freelancerId?.name || "Freelancer";

              return (
                <div
                  key={item._id}
                  style={{
                    backgroundColor: "#1a2a4a",
                    borderRadius: "10px",
                    overflow: "hidden",
                    border: "2px solid #00d4ff",
                    transition: "all 0.3s",
                    cursor: "pointer",
                    boxShadow: "0 5px 15px rgba(0, 212, 255, 0.15)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-10px)";
                    e.currentTarget.style.borderColor = "#00d4ff";
                    e.currentTarget.style.boxShadow = "0 15px 35px rgba(0, 212, 255, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor = "#00d4ff";
                    e.currentTarget.style.boxShadow = "0 5px 15px rgba(0, 212, 255, 0.15)";
                  }}
                >
                  {/* IMAGE */}
                  <img
                    src={item.image || "https://via.placeholder.com/300x180"}
                    alt={item.title}
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "cover"
                    }}
                  />

                  {/* CONTENT */}
                  <div style={{ padding: "20px" }}>
                    {/* TITLE */}
                    <h3 style={{
                      margin: "0 0 10px 0",
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "#fff"
                    }}>
                      {item.title}
                    </h3>

                    {/* DESCRIPTION */}
                    <p style={{
                      margin: "0 0 15px 0",
                      fontSize: "12px",
                      color: "#aaa",
                      lineHeight: "1.5",
                      minHeight: "35px"
                    }}>
                      {item.description?.substring(0, 80)}...
                    </p>

                    {/* META */}
                    <div style={{
                      display: "flex",
                      gap: "8px",
                      flexWrap: "wrap",
                      marginBottom: "15px",
                      fontSize: "11px"
                    }}>
                      <span style={{
                        backgroundColor: "#00d4ff",
                        color: "#000",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontWeight: "bold"
                      }}>
                        {item.category}
                      </span>
                      {item.location && (
                        <span style={{
                          backgroundColor: "#ff4444",
                          color: "#fff",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontWeight: "bold"
                        }}>
                          📍 {item.location}
                        </span>
                      )}
                    </div>

                    {/* SKILLS */}
                    {item.skills && (
                      <div style={{
                        display: "flex",
                        gap: "5px",
                        flexWrap: "wrap",
                        marginBottom: "15px"
                      }}>
                        {(Array.isArray(item.skills) ? item.skills : item.skills.split(",")).slice(0, 3).map(skill => (
                          <span
                            key={skill}
                            style={{
                              backgroundColor: "#0f172a",
                              color: "#00d4ff",
                              padding: "3px 8px",
                              borderRadius: "12px",
                              fontSize: "10px",
                              border: "1px solid #00d4ff"
                            }}
                          >
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* PRICE & RATING */}
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "15px",
                      paddingBottom: "15px",
                      borderBottom: "1px solid #333"
                    }}>
                      <div>
                        <p style={{ margin: "0", fontSize: "11px", color: "#aaa" }}>Price</p>
                        <p style={{
                          margin: "0",
                          fontSize: "18px",
                          fontWeight: "bold",
                          color: "#00d4ff"
                        }}>
                          ₹{item.price}
                        </p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ margin: "0", fontSize: "11px", color: "#aaa" }}>Rating</p>
                        <p style={{
                          margin: "0",
                          fontSize: "16px",
                          fontWeight: "bold",
                          color: "#ffc107"
                        }}>
                          ⭐ {item.averageRating?.toFixed(1) || "0"}
                        </p>
                      </div>
                    </div>

                    {/* FREELANCER */}
                    {freelancerId && (
                      <p style={{
                        margin: "0 0 15px 0",
                        fontSize: "11px",
                        color: "#00d4ff",
                        fontWeight: "bold"
                      }}>
                        👤 {freelancerName}
                      </p>
                    )}

                    {/* BUTTONS */}
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "10px",
                      marginBottom: "10px"
                    }}>
                      <button
                        onClick={() => navigate(`/services/${item._id}`)}
                        style={{
                          padding: "10px",
                          backgroundColor: "transparent",
                          border: "2px solid #00d4ff",
                          color: "#00d4ff",
                          borderRadius: "5px",
                          cursor: "pointer",
                          fontWeight: "bold",
                          fontSize: "12px",
                          textTransform: "uppercase",
                          transition: "all 0.3s"
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "#00d4ff";
                          e.target.style.color = "#000";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "transparent";
                          e.target.style.color = "#00d4ff";
                        }}
                      >
                        👁️ VIEW
                      </button>

                      <button
                        onClick={() => navigate(`/hire/${item._id}`)}
                        style={{
                          padding: "10px",
                          backgroundColor: "#ff6b35",
                          border: "none",
                          color: "white",
                          borderRadius: "5px",
                          cursor: "pointer",
                          fontWeight: "bold",
                          fontSize: "12px",
                          textTransform: "uppercase",
                          transition: "all 0.3s"
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "#ff5722";
                          e.target.style.transform = "scale(1.05)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "#ff6b35";
                          e.target.style.transform = "scale(1)";
                        }}
                      >
                        💼 HIRE
                      </button>
                    </div>

                    {/* PAY NOW */}
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
                          width: "100%",
                          padding: "10px",
                          backgroundColor: "#555",
                          color: "#999",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "not-allowed",
                          fontWeight: "bold",
                          fontSize: "12px",
                          textTransform: "uppercase"
                        }}
                      >
                        ⚠️ NO FREELANCER
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;