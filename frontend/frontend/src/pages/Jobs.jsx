import { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";


function Jobs() {

  const [jobs, setJobs] = useState([]);

  // FORM STATES
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("");
  const [skills, setSkills] = useState("");
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);


  // FETCH JOBS
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await API.get("/jobs");
      setJobs(res.data);
    } catch (err) {
      console.error("Fetch Jobs Error:", err);
      
    }
  };

  // SUBMIT JOB
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/jobs", {
        title,
        description,
        budget: Number(budget),
        duration,
        category,
        skills: skills ? skills.split(",") : []
      });

      alert("Job Posted Successfully ✅");

      // RESET FORM
      setTitle("");
      setDescription("");
      setBudget("");
      setDuration("");
      setCategory("");
      setSkills("");

      fetchJobs();

    } catch (err) {
      console.error("Post Job Error:", err);
      alert("Failed to post job ❌");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Job Marketplace</h1>

      {/* FORM */}
      <h2>Post a Job</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "30px" }}>

        <input
          placeholder="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Duration (e.g. 2 weeks)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Category (Web, Design...)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Skills (comma separated: react,node)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />
        <br /><br />

        <button
         onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          backgroundColor: hover ? "#51a511" : "#11a562c0",
          color: "white",
          padding: "8px 15px",
          borderRadius: "5px",
          border: "none",
          cursor: "pointer",
          transition: "0.3s",
          boxShadow: hover ? "0 4px 12px rgba(0,0,0,0.3)" : "none"
        }}
              type="submit"
         >Post Job</button>

      </form>

      {/* JOB LIST */}
      <h2>Available Jobs</h2>

      {jobs.length === 0 ? (
        <p>No jobs available</p>
      ) : (
        jobs.map((job) => (
          <div key={job._id} style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "10px",
            borderRadius: "8px"
          }}>
            <h3>{job.title}</h3>
            <p>{job.description}</p>
            <p>💰 Budget: ₹{job.budget}</p>
            <p>⏱ Duration: {job.duration || "N/A"}</p>
            <p>📂 Category: {job.category || "N/A"}</p>
            <p>
              ⭐ {job.averageRating ? job.averageRating.toFixed(1) : "No ratings"}
            </p>
            <p>🧠 Skills: {
              Array.isArray(job.skills)
                ? job.skills.join(", ")
                : ""
            }</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Jobs;