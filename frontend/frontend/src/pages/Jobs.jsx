import { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // FORM STATES
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [duration, setDuration] = useState("1 month");
  const [category, setCategory] = useState("");
  const [skills, setSkills] = useState("");
  const [location, setLocation] = useState("Remote");
  const [posting, setPosting] = useState(false);

  // FETCH JOBS
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      console.log("📋 Fetching jobs...");
      const res = await API.get("/jobs");
      console.log("✅ Jobs fetched:", res.data);
      setJobs(res.data || []);
    } catch (err) {
      console.error("❌ Fetch Jobs Error:", err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // POST JOB
  const handleSubmit = async (e) => {
    e.preventDefault();
    setPosting(true);

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?._id;

      if (!userId) {
        alert("❌ Please login first");
        navigate("/login");
        return;
      }

      console.log("📝 Posting job...");

      const res = await API.post("/jobs", {
        title,
        description,
        budget: Number(budget),
        duration,
        category,
        skills: skills ? skills.split(",").map(s => s.trim()) : [],
        location,
        postedBy: userId
      });

      console.log("✅ Job posted:", res.data);
      alert("✅ Job Posted Successfully!");

      // RESET FORM
      setTitle("");
      setDescription("");
      setBudget("");
      setDuration("1 month");
      setCategory("");
      setSkills("");
      setLocation("Remote");
      setShowForm(false);

      fetchJobs();

    } catch (err) {
      console.error("❌ Post Job Error:", err.response?.data || err);
      alert("❌ Failed to post job: " + (err.response?.data?.message || err.message));
    } finally {
      setPosting(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          backgroundColor: "#0f172a",
          minHeight: "100vh",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "18px",
        }}
      >
        ⏳ Loading jobs...
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#0f172a",
        minHeight: "100vh",
        color: "white",
        padding: "50px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "40px",
          }}
        >
          <h1
            style={{
              fontSize: "36px",
              fontWeight: "bold",
              color: "#00d4ff",
              margin: "0",
              textTransform: "uppercase",
            }}
          >
            💼 JOBS MARKETPLACE
          </h1>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              padding: "10px 20px",
              backgroundColor: "#00d4ff",
              color: "#000",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "14px",
              textTransform: "uppercase",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#00b8d4";
              e.target.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#00d4ff";
              e.target.style.transform = "scale(1)";
            }}
          >
            {showForm ? "✕ CLOSE" : "➕ POST JOB"}
          </button>
        </div>

        {/* POST JOB FORM */}
        {showForm && (
          <div
            style={{
              backgroundColor: "#1a2a4a",
              border: "2px solid #00d4ff",
              borderRadius: "10px",
              padding: "30px",
              marginBottom: "40px",
            }}
          >
            <h2 style={{ color: "#00d4ff", marginBottom: "20px" }}>📝 Post a New Job</h2>

            <form onSubmit={handleSubmit}>
              {/* TITLE */}
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                  Job Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Build a React Website"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: "#0f172a",
                    border: "1px solid #00d4ff",
                    color: "#00d4ff",
                    borderRadius: "5px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* DESCRIPTION */}
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                  Description
                </label>
                <textarea
                  placeholder="Describe your project..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: "#0f172a",
                    border: "1px solid #00d4ff",
                    color: "#00d4ff",
                    borderRadius: "5px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                    minHeight: "100px",
                  }}
                />
              </div>

              {/* BUDGET */}
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                  Budget (₹)
                </label>
                <input
                  type="number"
                  placeholder="Enter budget"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: "#0f172a",
                    border: "1px solid #00d4ff",
                    color: "#00d4ff",
                    borderRadius: "5px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* GRID: Duration, Category, Location */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "15px",
                  marginBottom: "15px",
                }}
              >
                {/* DURATION */}
                <div>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                    Duration
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      backgroundColor: "#0f172a",
                      border: "1px solid #00d4ff",
                      color: "#00d4ff",
                      borderRadius: "5px",
                      fontSize: "14px",
                    }}
                  >
                    <option value="1 week">1 Week</option>
                    <option value="2 weeks">2 Weeks</option>
                    <option value="1 month">1 Month</option>
                    <option value="2 months">2 Months</option>
                    <option value="3+ months">3+ Months</option>
                  </select>
                </div>

                {/* CATEGORY */}
                <div>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Web Development"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      backgroundColor: "#0f172a",
                      border: "1px solid #00d4ff",
                      color: "#00d4ff",
                      borderRadius: "5px",
                      fontSize: "14px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                {/* LOCATION */}
                <div>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Remote"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      backgroundColor: "#0f172a",
                      border: "1px solid #00d4ff",
                      color: "#00d4ff",
                      borderRadius: "5px",
                      fontSize: "14px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              {/* SKILLS */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                  Required Skills (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g., React, Node.js, MongoDB"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: "#0f172a",
                    border: "1px solid #00d4ff",
                    color: "#00d4ff",
                    borderRadius: "5px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* BUTTONS */}
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="submit"
                  disabled={posting}
                  style={{
                    flex: 1,
                    padding: "12px",
                    backgroundColor: posting ? "#555" : "#00d4ff",
                    color: posting ? "#999" : "#000",
                    border: "none",
                    borderRadius: "5px",
                    cursor: posting ? "not-allowed" : "pointer",
                    fontWeight: "bold",
                    fontSize: "14px",
                    textTransform: "uppercase",
                    transition: "all 0.3s",
                  }}
                >
                  {posting ? "⏳ POSTING..." : "📤 POST JOB"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{
                    padding: "12px 20px",
                    backgroundColor: "#555",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "14px",
                    textTransform: "uppercase",
                  }}
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        )}

        {/* JOBS LIST */}
        <h2 style={{ color: "#00d4ff", marginBottom: "20px", textTransform: "uppercase" }}>
          📋 Available Jobs ({jobs.length})
        </h2>

        {jobs.length === 0 ? (
          <div
            style={{
              backgroundColor: "#1a2a4a",
              border: "2px solid #00d4ff",
              padding: "50px",
              borderRadius: "10px",
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: "18px", color: "#aaa", marginBottom: "20px" }}>
              📭 No jobs available yet
            </p>
            <button
              onClick={() => setShowForm(true)}
              style={{
                padding: "10px 20px",
                backgroundColor: "#00d4ff",
                color: "#000",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              ➕ POST FIRST JOB
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
              gap: "20px",
            }}
          >
            {jobs.map((job) => (
              <div
                key={job._id}
                style={{
                  backgroundColor: "#1a2a4a",
                  border: "2px solid #00d4ff",
                  borderRadius: "10px",
                  padding: "20px",
                  transition: "all 0.3s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 212, 255, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* TITLE */}
                <h3
                  style={{
                    margin: "0 0 10px 0",
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#00d4ff",
                  }}
                >
                  {job.title}
                </h3>

                {/* DESCRIPTION */}
                <p
                  style={{
                    margin: "0 0 15px 0",
                    fontSize: "13px",
                    color: "#aaa",
                    lineHeight: "1.5",
                    minHeight: "40px",
                  }}
                >
                  {job.description?.substring(0, 100)}...
                </p>

                {/* META INFO */}
                <div style={{ marginBottom: "15px", fontSize: "12px" }}>
                  <p style={{ margin: "5px 0", fontWeight: "bold" }}>
                    💰 Budget: <span style={{ color: "#00d4ff" }}>₹{job.budget}</span>
                  </p>
                  <p style={{ margin: "5px 0" }}>⏱ Duration: {job.duration}</p>
                  <p style={{ margin: "5px 0" }}>📂 Category: {job.category}</p>
                  <p style={{ margin: "5px 0" }}>📍 Location: {job.location}</p>
                  {job.averageRating > 0 && (
                    <p style={{ margin: "5px 0" }}>
                      ⭐ Rating: {job.averageRating?.toFixed(1)}/5
                    </p>
                  )}
                </div>

                {/* SKILLS */}
                {job.skills && job.skills.length > 0 && (
                  <div style={{ marginBottom: "15px", display: "flex", gap: "5px", flexWrap: "wrap" }}>
                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        style={{
                          backgroundColor: "rgba(0, 212, 255, 0.2)",
                          color: "#00d4ff",
                          padding: "3px 8px",
                          borderRadius: "12px",
                          fontSize: "11px",
                          border: "1px solid #00d4ff",
                        }}
                      >
                        🛠 {skill}
                      </span>
                    ))}
                  </div>
                )}

                {/* STATUS */}
                <div
                  style={{
                    display: "inline-block",
                    padding: "5px 10px",
                    backgroundColor: "rgba(0, 212, 255, 0.2)",
                    color: "#00d4ff",
                    borderRadius: "5px",
                    fontSize: "11px",
                    fontWeight: "bold",
                    marginBottom: "15px",
                    textTransform: "uppercase",
                  }}
                >
                  {job.status}
                </div>

                {/* VIEW BUTTON */}
                <button
                  onClick={() => navigate(`/jobs/${job._id}`)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: "#00d4ff",
                    color: "#000",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "13px",
                    textTransform: "uppercase",
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#00b8d4";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#00d4ff";
                  }}
                >
                  👁️ VIEW DETAILS
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Jobs;