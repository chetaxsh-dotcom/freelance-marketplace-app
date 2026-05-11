import { useEffect, useState } from 'react';
import API from '../api/api';

const MilestonesList = ({ jobId }) => {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMilestones();
  }, [jobId]);

  const fetchMilestones = async () => {
    try {
      const res = await API.get(`/milestones/${jobId}`);  // ← NO /api
      setMilestones(res.data);
    } catch (error) {
      console.error('Failed to fetch milestones');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (milestoneId, newStatus) => {
    try {
      await API.patch(`/milestones/${milestoneId}/status`, { status: newStatus });  // ← NO /api
      alert('✅ Status updated');
      fetchMilestones();
    } catch (error) {
      alert('❌ Failed to update');
    }
  };

  const releaseMilestone = async (milestoneId) => {
    try {
      await API.patch(`/milestones/${milestoneId}/release`);  
      alert('✅ Payment released to freelancer!');
      fetchMilestones();
    } catch (error) {
      alert('❌ Failed to release');
    }
  };

  if (loading) return <p>Loading milestones...</p>;

  return (
    <div style={{ marginTop: '20px' }}>
      <h3>📋 Payment Milestones</h3>
      
      {milestones.length === 0 ? (
        <p>No milestones created yet</p>
      ) : (
        milestones.map((milestone) => (
          <div key={milestone._id} style={{ 
            border: '1px solid #ddd', 
            padding: '15px', 
            marginBottom: '10px',
            borderRadius: '5px'
          }}>
            <h4>{milestone.title}</h4>
            <p><strong>Amount:</strong> ₹{milestone.amount}</p>
            <p><strong>Due Date:</strong> {new Date(milestone.dueDate).toLocaleDateString()}</p>
            <p><strong>Status:</strong> {milestone.status}</p>

            <select 
              value={milestone.status}
              onChange={(e) => updateStatus(milestone._id, e.target.value)}
              style={{ padding: '8px', marginRight: '10px' }}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="released">Released</option>
            </select>

            {milestone.status === 'completed' && (
              <button
                onClick={() => releaseMilestone(milestone._id)}
                style={{
                  padding: '8px 15px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                💰 Release Payment
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MilestonesList;