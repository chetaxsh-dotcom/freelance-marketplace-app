import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';

const CreateServiceForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    skills: '',
    location: '',
    image: ''
    

  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      // Get logged-in user
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user?._id;

      console.log('👤 Logged-in user:', user);
      console.log('🆔 UserId:', userId);

      if (!userId) {
        alert('❌ Please login first');
        navigate('/login');
        return;
      }

      console.log('📝 Creating service with userId:', userId);

      const res = await API.post('/services/create', {
        ...formData,
        price: parseFloat(formData.price),
        userId  // ← Send userId
      });

      if (res.data.success) {
        console.log('✅ Service created:', res.data.service);
        alert('✅ Service created successfully!');

        // Reset form
        setFormData({
          title: '',
          description: '',
          price: '',
          category: '',
          skills: '',
          location: '',
          image: ''
        });

        // Redirect to home
        navigate('/');
      }
    } catch (error) {
      console.error('❌ Error:', error);
      alert('❌ Failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px' }}>
      <h1>➕ Create New Service</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Service Title (e.g., Web Development)"
          value={formData.title}
          onChange={handleChange}
          required
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '15px',
            border: '1px solid #ddd',
            borderRadius: '5px'
          }}
        />

        <textarea
          name="description"
          placeholder="Service Description"
          value={formData.description}
          onChange={handleChange}
          required
          rows="4"
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '15px',
            border: '1px solid #ddd',
            borderRadius: '5px'
          }}
        />

        <input
          type="number"
          name="price"
          placeholder="Price (₹)"
          value={formData.price}
          onChange={handleChange}
          required
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '15px',
            border: '1px solid #ddd',
            borderRadius: '5px'
          }}
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '15px',
            border: '1px solid #ddd',
            borderRadius: '5px'
          }}
        >
          <option value="">Select Category</option>
          <option value="web-development">Web Development</option>
          <option value="graphic-design">Graphic Design</option>
          <option value="writing">Writing</option>
          <option value="digital-marketing">Digital Marketing</option>
          <option value="video-editing">Video Editing</option>
          <option value="other">Other</option>
        </select>

        <input
          type="text"
          name="skills"
          placeholder="Skills (comma separated: React, Node.js, etc)"
          value={formData.skills}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '15px',
            border: '1px solid #ddd',
            borderRadius: '5px'
          }}
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '15px',
            border: '1px solid #ddd',
            borderRadius: '5px'
          }}
        />

        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '15px',
            border: '1px solid #ddd',
            borderRadius: '5px'
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? '⏳ Creating...' : '✅ Create Service'}
        </button>
      </form>
    </div>
  );
};

export default CreateServiceForm;