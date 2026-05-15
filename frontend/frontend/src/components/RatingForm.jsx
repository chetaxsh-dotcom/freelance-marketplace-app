import { useState } from 'react';
import API from '../api/api';

const RatingForm = ({ serviceId, onRatingAdded }) => {
  const [formData, setFormData] = useState({
    value: 5,
    review: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get user from localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user?._id || user?.id;

      console.log('📝 Submitting rating:', { serviceId, userId, ...formData });

      // Validation
      if (!userId) {
        alert('❌ Please login first to submit a rating');
        window.location.href = '/login';
        return;
      }

      if (!formData.review || formData.review.trim().length === 0) {
        alert('❌ Please write a review');
        return;
      }

      // Submit rating
      const res = await API.post(`/services/${serviceId}/rate`, {
        value: parseInt(formData.value),
        review: formData.review.trim(),
        userId
      });

      if (res.data.success) {
        console.log('✅ Rating added successfully');
        alert('✅ Rating added successfully!');
        
        // Reset form
        setFormData({ value: 5, review: '' });
        
        // Update parent component
        if (onRatingAdded) {
          onRatingAdded(res.data.service);
        }
      }
    } catch (error) {
      console.error('❌ Error adding rating:', error);
      alert('❌ Failed to add rating: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      border: '2px solid #28a745',
      padding: '20px',
      borderRadius: '8px',
      marginTop: '20px',
      backgroundColor: '#f0fff4'
    }}>
      <h3>✍️ Leave Your Review</h3>

      <form onSubmit={handleSubmit}>
        {/* Star Rating */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
            ⭐ Rating:
          </label>
          <select
            name="value"
            value={formData.value}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px'
            }}
          >
            <option value="5">⭐⭐⭐⭐⭐ Excellent (5 Stars)</option>
            <option value="4">⭐⭐⭐⭐ Very Good (4 Stars)</option>
            <option value="3">⭐⭐⭐ Good (3 Stars)</option>
            <option value="2">⭐⭐ Fair (2 Stars)</option>
            <option value="1">⭐ Poor (1 Star)</option>
          </select>
        </div>

        {/* Review Text */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
            📝 Your Review:
          </label>
          <textarea
            name="review"
            placeholder="Share your experience with this service..."
            value={formData.review}
            onChange={handleChange}
            required
            rows="5"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '14px',
              fontFamily: 'Arial, sans-serif'
            }}
          />
          <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
            {formData.review.length}/500 characters
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: loading ? '#cccccc' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            fontSize: '16px',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? '⏳ Submitting...' : '✅ Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default RatingForm;