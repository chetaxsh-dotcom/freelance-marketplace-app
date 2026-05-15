import { useEffect, useState } from 'react';
import API from '../api/api';

const RatingsList = ({ serviceId }) => {
  const [ratings, setRatings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!serviceId) return;
    fetchRatings();
  }, [serviceId]);

  const fetchRatings = async () => {
    try {
      console.log('📋 Fetching ratings for serviceId:', serviceId);
      const res = await API.get(`/services/${serviceId}/ratings`);
      console.log('✅ Ratings fetched:', res.data);
      setRatings(res.data);
    } catch (error) {
      console.error('❌ Error fetching ratings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading ratings...</p>;

  if (!ratings || ratings.totalRatings === 0) {
    return <p>No ratings yet. Be the first to review!</p>;
  }

  return (
    <div style={{ marginTop: '20px' }}>
      <h3>⭐ Reviews & Ratings</h3>

      {/* Rating Summary */}
      <div style={{
        padding: '15px',
        backgroundColor: '#fff9e6',
        borderRadius: '8px',
        marginBottom: '15px'
      }}>
        <p>
          <strong>Average Rating:</strong>{' '}
          <span style={{ fontSize: '18px', color: '#ffc107' }}>
            {ratings.averageRating} / 5
          </span>
        </p>
        <p><strong>Total Reviews:</strong> {ratings.totalRatings}</p>
      </div>

      {/* Individual Ratings */}
      {ratings.ratings.map((rating, idx) => (
        <div
          key={idx}
          style={{
            border: '1px solid #ddd',
            padding: '15px',
            marginBottom: '10px',
            borderRadius: '5px',
            backgroundColor: '#f9f9f9'
          }}
        >
          <div style={{ marginBottom: '10px' }}>
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
              {'⭐'.repeat(rating.value)}
            </span>
            <span style={{ marginLeft: '10px', color: '#666', fontSize: '14px' }}>
              {new Date(rating.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p style={{ lineHeight: '1.5', color: '#333' }}>
            {rating.review}
          </p>
        </div>
      ))}
    </div>
  );
};

export default RatingsList;