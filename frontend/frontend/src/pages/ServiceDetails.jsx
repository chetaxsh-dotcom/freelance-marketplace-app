import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/api";

const ServiceDetails = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);

  useEffect(() => {
  if (!id) return;

  console.log("Fetching ID:", id);
  fetchService();
}, [id]);

const fetchService = async () => {
  try {
    const res = await API.get(`/services/${id}`);
    setService(res.data);
  } catch (err) {
    console.error(err);
    alert("Service not found ❌");
  }
};

  if (!service) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{service.title}</h1>
      <p>{service.description}</p>
      <p>💰 ₹{service.price}</p>

      <p>
  <strong>🛠 Skills:</strong>
  {service.skills?.join(", ")}
</p>

      <p>
        ⭐ {service.averageRating }
      </p>

      <br></br>

    <h3 style={{ marginTop: "20px" }}>Reviews</h3>

{service.ratings?.length === 0 ? (
  <p>No reviews yet</p>
) : (
  service.ratings.map((r, index) => (
    <div
      key={index}
      style={{
        border: "1px solid #ddd",
        padding: "10px",
        borderRadius: "8px",
        marginTop: "10px",
        background: "#f9f9f9"
      }}
    >
      <p>⭐ {r.value}</p>
      <p>{r.review}</p>
    </div>
  ))
)}

    </div>
    
  );
};

export default ServiceDetails;