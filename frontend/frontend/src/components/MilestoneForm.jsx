import { useState } from 'react';
import API from '../api/api';

const MilestoneForm = ({ jobId, onMilestoneCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    dueDate: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post('/milestones/create', {  
        jobId,
        ...formData,
        amount: parseFloat(formData.amount)
      });

      alert('✅ Milestone created!');
      setFormData({ title: '', description: '', amount: '', dueDate: '' });
      
      if (onMilestoneCreated) {
        onMilestoneCreated(res.data.milestone);
      }
    } catch (error) {
      alert('❌ Failed to create milestone');
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }}>
      <h3>📅 Create Payment Milestone</h3>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Milestone title (e.g., Design Phase)"
          value={formData.title}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />

        <input
          type="number"
          name="amount"
          placeholder="Amount (₹)"
          value={formData.amount}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />

        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />

        <button 
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          ➕ Create Milestone
        </button>
      </form>
    </div>
  );
};

export default MilestoneForm;