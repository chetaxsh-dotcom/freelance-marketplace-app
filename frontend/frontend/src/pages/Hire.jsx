import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/api';

const Hire = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: ''
  });

  useEffect(() => {
    fetchService();
  }, [id]);

  const fetchService = async () => {
    try {
      console.log('📋 Fetching service:', id);
      const res = await API.get(`/services/${id}`);
      console.log('✅ Service fetched:', res.data);
      setService(res.data);
      setFormData({
        title: res.data.title || '',
        description: res.data.description || '',
        deadline: ''
      });
    } catch (error) {
      console.error('❌ Fetch error:', error);
      alert('❌ Failed to load service');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const clientId = user?._id;

      if (!clientId) {
        alert('❌ Please login first');
        navigate('/login');
        return;
      }

      const freelancerId = service.freelancerId?._id || service.freelancerId;

      if (!freelancerId) {
        alert('❌ Freelancer information missing');
        return;
      }

      if (clientId === freelancerId) {
        alert('❌ You cannot hire yourself!');
        return;
      }

      console.log('📝 Creating contract...');

      const res = await API.post('/contracts', {
        jobId: id,
        clientId,
        freelancerId,
        title: formData.title,
        description: formData.description,
        budget: service.price,
        deadline: formData.deadline ? new Date(formData.deadline) : null
      });

      console.log('✅ Contract created:', res.data);
      alert('✅ Contract sent successfully!');

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (error) {
      console.error('❌ Contract error:', error);
      alert('❌ Failed to send contract: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          backgroundColor: '#0f172a',
          minHeight: '100vh',
          color: 'white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '18px',
        }}
      >
        ⏳ Loading...
      </div>
    );
  }

  if (!service) {
    return (
      <div
        style={{
          backgroundColor: '#0f172a',
          minHeight: '100vh',
          color: 'white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '18px',
        }}
      >
        ❌ Service not found
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: '#0f172a',
        minHeight: '100vh',
        color: 'white',
        padding: '50px',
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#555',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginBottom: '30px',
            fontWeight: 'bold',
          }}
        >
          ← BACK
        </button>

        {/* HEADER */}
        <h1 style={{ color: '#00d4ff', marginBottom: '30px', textTransform: 'uppercase' }}>
          💼 SEND CONTRACT
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          {/* SERVICE INFO */}
          <div
            style={{
              backgroundColor: '#1a2a4a',
              border: '2px solid #00d4ff',
              padding: '20px',
              borderRadius: '10px',
            }}
          >
            <h2 style={{ color: '#00d4ff', marginTop: '0' }}>📋 Service Details</h2>

            <img
              src={service.image || 'https://via.placeholder.com/300x200'}
              alt={service.title}
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '8px',
                marginBottom: '15px',
              }}
            />

            <p style={{ margin: '10px 0', fontSize: '13px' }}>
              <strong>📝 Title:</strong> {service.title}
            </p>
            <p style={{ margin: '10px 0', fontSize: '13px' }}>
              <strong>💰 Price:</strong> ₹{service.price}
            </p>
            <p style={{ margin: '10px 0', fontSize: '13px' }}>
              <strong>📂 Category:</strong> {service.category}
            </p>
            <p style={{ margin: '10px 0', fontSize: '13px' }}>
              <strong>👤 Freelancer:</strong> {service.freelancerId?.name || 'N/A'}
            </p>
            <p style={{ margin: '10px 0', fontSize: '13px' }}>
              <strong>⭐ Rating:</strong> {service.averageRating?.toFixed(1) || '0'}/5
            </p>

            {service.description && (
              <p style={{ margin: '10px 0', fontSize: '13px', color: '#aaa', minHeight: '60px' }}>
                <strong>📝 Description:</strong> {service.description?.substring(0, 100)}...
              </p>
            )}
          </div>

          {/* CONTRACT FORM */}
          <div
            style={{
              backgroundColor: '#1a2a4a',
              border: '2px solid #00d4ff',
              padding: '20px',
              borderRadius: '10px',
            }}
          >
            <h2 style={{ color: '#00d4ff', marginTop: '0' }}>📤 Contract Details</h2>

            <form onSubmit={handleSubmit}>
              {/* TITLE */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '13px' }}>
                  Contract Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter contract title"
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#0f172a',
                    border: '1px solid #00d4ff',
                    color: '#00d4ff',
                    borderRadius: '5px',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* DESCRIPTION */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '13px' }}>
                  Project Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe the project details..."
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#0f172a',
                    border: '1px solid #00d4ff',
                    color: '#00d4ff',
                    borderRadius: '5px',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    minHeight: '100px',
                  }}
                />
              </div>

              {/* DEADLINE */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '13px' }}>
                  Deadline (Optional)
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) =>
                    setFormData({ ...formData, deadline: e.target.value })
                  }
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#0f172a',
                    border: '1px solid #00d4ff',
                    color: '#00d4ff',
                    borderRadius: '5px',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* BUDGET INFO */}
              <div
                style={{
                  backgroundColor: 'rgba(0, 212, 255, 0.1)',
                  padding: '10px',
                  borderRadius: '5px',
                  marginBottom: '20px',
                  fontSize: '13px',
                }}
              >
                <p style={{ margin: '0' }}>
                  <strong>💰 Budget:</strong> ₹{service.price}
                </p>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: submitting ? '#555' : '#00d4ff',
                  color: submitting ? '#999' : '#000',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  transition: 'all 0.3s',
                }}
              >
                {submitting ? '⏳ SENDING...' : '📤 SEND CONTRACT'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hire;