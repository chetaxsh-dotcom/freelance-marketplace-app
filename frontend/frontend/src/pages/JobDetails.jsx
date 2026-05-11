import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";
import PaymentButton from "../components/PaymentButton";
import ServiceDetails from "./ServiceDetails";

const JobDetails = () => {
  const { jobId } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  //  RATING STATE
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (jobId) fetchJobDetails();
  }, [jobId]);

  //  FIXED FUNCTION (IMPORTANT)
  const fetchJobDetails = async () => {
    try {
      console.log("Fetching ID:", jobId);

      const res = await API.get(`/services/${jobId}`);
      setJob(res.data);

    } catch (err) {
      console.error("ERROR:", err);
      alert("Job not found ❌");
      setJob(null); //  VERY IMPORTANT FIX

    } finally {
      setLoading(false); //  ALWAYS STOP LOADING
    }
  };

  //  SUBMIT RATING
  const submitRating = async () => {
    if (!rating) return alert("Select rating ⭐");

    try {
      setSubmitting(true);

      const token = localStorage.getItem("token");

      await API.post(
        `/services/${jobId}/rate`,
        { value: rating, review },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Rating submitted ✅");

      setRating(0);
      setReview("");

      fetchJobDetails(); // refresh

    } catch (err) {
      console.error(err);
      alert("Rating failed ❌");
    } finally {
      setSubmitting(false);
    }
  };

  //  UI STATES
  if (loading) return <p>Loading...</p>;
  if (!job) return <p>Job not found</p>;

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>

      {/* JOB INFO */}
      <div style={{
        border: "1px solid #ddd",
        padding: "20px",
        borderRadius: "8px",
        marginBottom: "20px",
        backgroundColor: "#f9f9f9"
      }}>
        <h1>{job.title}</h1>
        <p>{job.description}</p>

        <p><strong>💰 Budget:</strong> ₹{job.budget}</p>
        <p><strong>⏱ Duration:</strong> {job.duration || "N/A"}</p>
        <p><strong>📂 Category:</strong> {job.category || "N/A"}</p>

        {job.ratings && job.ratings.length > 0 ? (
        job.ratings.map((r, i) => (
          <div key={i}>
            <p>⭐ {r.value}</p>
            <p>{r.review}</p>
          </div>
        ))
      ) : (
        <p>No reviews yet</p>
      )}

      </div>

      {/* ⭐ RATING */}
      <div style={{
        border: "1px solid #ddd",
        padding: "20px",
        borderRadius: "8px",
        marginBottom: "20px"
      }}>
        <h2>⭐ Rate this Job</h2>

        <div style={{ fontSize: "28px", cursor: "pointer" }}>
          {[1,2,3,4,5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              style={{
                color: star <= rating ? "#ffc107" : "#ccc"
              }}
            >
              ★
            </span>
          ))}
        </div>

        <textarea
          placeholder="Write review..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
          style={{
            width: "100%",
            marginTop: "10px",
            padding: "10px",
            borderRadius: "5px"
          }}
        />

        <button
          onClick={submitRating}
          disabled={submitting}
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            background: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          {submitting ? "Submitting..." : "Submit Rating"}
        </button>
      </div>

      {/* 💳 PAYMENT */}
      <div style={{
        border: "1px solid #ddd",
        padding: "20px",
        borderRadius: "8px",
        backgroundColor: "#f0f8ff"
      }}>
        <h2>💳 Payment</h2>

        <PaymentButton
          amount={job.budget}
          jobId={job._id}
          freelancerId={job.freelancerId || "unknown"}
        />
      </div>

      {/* 📝 REVIEWS */}
      <div style={{
        border: "1px solid #ddd",
        padding: "20px",
        borderRadius: "8px",
        marginTop: "20px"
      }}>
        <h2>📝 Reviews</h2>

        {job.ratings && job.ratings.length > 0 ? (
          job.ratings.map((r, i) => (
            <div key={i}>
              <p>⭐ {r.value}</p>
              <p>{r.review || "No comment"}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet</p>
        )}
      </div>

    </div>
  );
};

export default JobDetails;