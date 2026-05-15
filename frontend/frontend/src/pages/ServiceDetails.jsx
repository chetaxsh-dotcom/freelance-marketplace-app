import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/api";
import RatingForm from '../components/RatingForm';
import PaymentButton from '../components/PaymentButton';

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    console.log("📝 Fetching Service ID:", id);
    fetchService();
  }, [id]);

  const fetchService = async () => {
    try {
      const res = await API.get(`/services/${id}`);
      console.log("✅ Service fetched:", res.data);
      setService(res.data);
    } catch (err) {
      console.error("❌ Error fetching service:", err);
      alert("❌ Service not found");
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleRatingAdded = (updatedService) => {
    setService(updatedService);
  };

  if (loading) {
    return <p style={{ padding: '20px' }}>⏳ Loading service details...</p>;
  }

  if (!service) {
    return <p style={{ padding: '20px' }}>❌ Service not found</p>;
  }

  // DEBUG: Log freelancerId
  console.log("🔍 Service freelancerId:", service.freelancerId);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      
      {/* SERVICE HEADER */}
      <div style={{
        border: '1px solid #ddd',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        backgroundColor: '#f9f9f9'
      }}>
        {/* Image */}
        <img
          src={service.image || 'https://via.placeholder.com/600x300'}
          alt={service.title}
          style={{
            width: '100%',
            height: '300px',
            objectFit: 'cover',
            borderRadius: '8px',
            marginBottom: '15px'
          }}
        />

        {/* Title & Basic Info */}
        <h1 style={{ marginBottom: '10px' }}>{service.title}</h1>
        
        <p style={{ fontSize: '16px', color: '#666', marginBottom: '15px' }}>
          {service.description}
        </p>

        {/* Price & Rating Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '15px',
          marginBottom: '15px'
        }}>
          <div>
            <p><strong>💰 Price:</strong></p>
            <p style={{ fontSize: '20px', color: '#28a745', fontWeight: 'bold' }}>
              ₹{service.price}
            </p>
          </div>

          <div>
            <p><strong>⭐ Rating:</strong></p>
            <p style={{ fontSize: '20px', color: '#ffc107', fontWeight: 'bold' }}>
              {service.averageRating?.toFixed(1) || '0'} / 5
            </p>
          </div>

          <div>
            <p><strong>📝 Reviews:</strong></p>
            <p style={{ fontSize: '20px', fontWeight: 'bold' }}>
              {service.ratings?.length || 0}
            </p>
          </div>
        </div>

        {/* Category & Skills */}
        <div style={{ marginBottom: '15px' }}>
          <p>
            <strong>📁 Category:</strong> {service.category}
          </p>
        </div>

        {/* Skills - FIX: Handle both string and array */}
        {service.skills && (
          <div style={{ marginBottom: '15px' }}>
            <p><strong>🛠 Skills:</strong></p>
            <p>
              {/* Check if skills is array or string */}
              {Array.isArray(service.skills) 
                ? service.skills.map(skill => (
                    <span
                      key={skill}
                      style={{
                        display: 'inline-block',
                        backgroundColor: '#e3f2fd',
                        color: '#0066cc',
                        padding: '5px 10px',
                        borderRadius: '20px',
                        marginRight: '8px',
                        marginBottom: '5px',
                        fontSize: '14px'
                      }}
                    >
                      {skill}
                    </span>
                  ))
                : service.skills.split(',').map(skill => (
                    <span
                      key={skill}
                      style={{
                        display: 'inline-block',
                        backgroundColor: '#e3f2fd',
                        color: '#0066cc',
                        padding: '5px 10px',
                        borderRadius: '20px',
                        marginRight: '8px',
                        marginBottom: '5px',
                        fontSize: '14px'
                      }}
                    >
                      {skill.trim()}
                    </span>
                  ))
              }
            </p>
          </div>
        )}

        {service.location && (
          <div style={{ marginBottom: '15px' }}>
            <p><strong>📍 Location:</strong> {service.location}</p>
          </div>
        )}

        {/* Freelancer Info - FIX: Handle object vs string */}
        {service.freelancerId && (
          <div style={{
            backgroundColor: '#f0f8ff',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '15px'
          }}>
            <p><strong>👤 Freelancer:</strong></p>
            <p>
              {typeof service.freelancerId === 'object'
                ? service.freelancerId?.name || 'Unknown'
                : 'Freelancer Information'}
            </p>
            {typeof service.freelancerId === 'object' && (
              <p style={{ fontSize: '14px', color: '#666' }}>
                {service.freelancerId?.email || 'Email not available'}
              </p>
            )}
          </div>
        )}
      </div>

      {/* PAYMENT SECTION - FIX: Handle freelancerId properly */}
      <div style={{
        border: '1px solid #ddd',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        backgroundColor: '#f0f8ff'
      }}>
        <h2>💳 Purchase This Service</h2>
        
        {service.freelancerId ? (
          <PaymentButton
            amount={service.price}
            jobId={service._id}
            freelancerId={
              typeof service.freelancerId === 'object'
                ? service.freelancerId._id
                : service.freelancerId
            }
            serviceName={service.title}
          />
        ) : (
          <div style={{
            padding: '15px',
            backgroundColor: '#fff3cd',
            borderRadius: '5px',
            border: '1px solid #ffc107'
          }}>
            <p>⚠️ Freelancer information not available for this service</p>
          </div>
        )}
      </div>

      {/* RATINGS & REVIEWS SECTION */}
      <div style={{
        border: '1px solid #ddd',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h2>⭐ Reviews & Ratings</h2>

        {/* Display Ratings */}
        {service.ratings && service.ratings.length > 0 ? (
          <div>
            <div style={{
              backgroundColor: '#fff9e6',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '15px'
            }}>
              <p><strong>Average Rating:</strong> {service.averageRating?.toFixed(1)} / 5</p>
              <p><strong>Total Reviews:</strong> {service.ratings.length}</p>
            </div>

            <h3>Recent Reviews:</h3>
            {service.ratings.map((rating, index) => (
              <div
                key={index}
                style={{
                  border: '1px solid #ddd',
                  padding: '15px',
                  borderRadius: '8px',
                  marginBottom: '10px',
                  backgroundColor: '#f9f9f9'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '10px'
                }}>
                  <p style={{ fontSize: '16px', fontWeight: 'bold' }}>
                    {'⭐'.repeat(rating.value)}{' '}
                    <span style={{ color: '#666' }}>({rating.value}/5)</span>
                  </p>
                  <p style={{
                    fontSize: '12px',
                    color: '#999'
                  }}>
                    {new Date(rating.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <p style={{
                  fontSize: '14px',
                  lineHeight: '1.5',
                  color: '#333'
                }}>
                  {rating.review}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#666' }}>No reviews yet. Be the first to review!</p>
        )}

        {/* Rating Form */}
        <RatingForm
          serviceId={id}
          onRatingAdded={handleRatingAdded}
        />
      </div>
    </div>
  );
};

export default ServiceDetails;