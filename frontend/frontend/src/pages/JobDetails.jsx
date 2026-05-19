import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/api';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState('');
  const [proposalText, setProposalText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      console.log('📋 Fetching job details:', id);
      const res = await API.get(`/jobs/${id}`);
      console.log('✅ Job details:', res.data);
      setJob(res.data);
    } catch (error) {
      console.error('❌ Fetch error:', error);
      alert('❌ Failed to load job details');
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitProposal = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const freelancerId = user?._id;

      if (!freelancerId) {
        alert('❌ Please login first');
        navigate('/login');
        return;
      }

      if (freelancerId === job.postedBy._id) {
        alert('❌ You cannot bid on your own job!');
        return;
      }

      console.log('📝 Submitting proposal...');

      const res = await API.post(`/jobs/${id}/proposals`, {
        freelancerId,
        proposalText,
        bidAmount: Number(bidAmount)
      });

      console.log('✅ Proposal submitted:', res.data);
      alert('✅ Proposal submitted successfully!');

      setBidAmount('');
      setProposalText('');
      fetchJobDetails();

    } catch (error) {
      console.error('❌ Proposal error:', error);
      alert('❌ Failed to submit proposal: ' + (error.response?.data?.message || error.message));
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
        ⏳ Loading job details...
      </div>
    );
  }

  if (!job) {
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
        ❌ Job not found
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
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate('/jobs')}
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

        {/* JOB HEADER */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ color: '#00d4ff', margin: '0 0 10px 0', fontSize: '36px' }}>
            {job.title}
          </h1>

          <div style={{ display: 'flex', gap: '20px', fontSize: '14px', marginBottom: '20px' }}>
            <div style={{ backgroundColor: 'rgba(0, 212, 255, 0.2)', padding: '8px 15px', borderRadius: '5px' }}>
              💰 <strong>₹{job.budget}</strong>
            </div>
            <div style={{ backgroundColor: 'rgba(255, 107, 53, 0.2)', padding: '8px 15px', borderRadius: '5px' }}>
              ⏱ <strong>{job.duration}</strong>
            </div>
            <div style={{ backgroundColor: 'rgba(40, 167, 69, 0.2)', padding: '8px 15px', borderRadius: '5px' }}>
              📂 <strong>{job.category}</strong>
            </div>
            <div style={{ backgroundColor: 'rgba(252, 193, 7, 0.2)', padding: '8px 15px', borderRadius: '5px' }}>
              📍 <strong>{job.location}</strong>
            </div>
          </div>

          <div
            style={{
              display: 'inline-block',
              padding: '8px 15px',
              backgroundColor:
                job.status === 'open'
                  ? 'rgba(40, 167, 69, 0.2)'
                  : job.status === 'assigned'
                  ? 'rgba(0, 212, 255, 0.2)'
                  : 'rgba(255, 107, 53, 0.2)',
              color:
                job.status === 'open'
                  ? '#28a745'
                  : job.status === 'assigned'
                  ? '#00d4ff'
                  : '#ff6b35',
              borderRadius: '5px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              fontSize: '12px',
            }}
          >
            {job.status}
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
          {/* LEFT COLUMN */}
          <div>
            {/* DESCRIPTION */}
            <div
              style={{
                backgroundColor: '#1a2a4a',
                border: '2px solid #00d4ff',
                padding: '20px',
                borderRadius: '10px',
                marginBottom: '20px',
              }}
            >
              <h2 style={{ color: '#00d4ff', marginTop: '0' }}>📝 Project Description</h2>
              <p style={{ color: '#aaa', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                {job.description}
              </p>
            </div>

            {/* SKILLS */}
            {job.skills && job.skills.length > 0 && (
              <div
                style={{
                  backgroundColor: '#1a2a4a',
                  border: '2px solid #00d4ff',
                  padding: '20px',
                  borderRadius: '10px',
                  marginBottom: '20px',
                }}
              >
                <h2 style={{ color: '#00d4ff', marginTop: '0' }}>🛠 Required Skills</h2>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      style={{
                        backgroundColor: 'rgba(0, 212, 255, 0.2)',
                        color: '#00d4ff',
                        padding: '8px 15px',
                        borderRadius: '20px',
                        border: '1px solid #00d4ff',
                        fontWeight: 'bold',
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* PROPOSALS */}
            <div
              style={{
                backgroundColor: '#1a2a4a',
                border: '2px solid #00d4ff',
                padding: '20px',
                borderRadius: '10px',
              }}
            >
              <h2 style={{ color: '#00d4ff', marginTop: '0' }}>
                💼 Proposals ({job.proposals?.length || 0})
              </h2>

              {job.proposals && job.proposals.length > 0 ? (
                job.proposals.map((proposal, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: '#0f172a',
                      padding: '15px',
                      borderRadius: '8px',
                      marginBottom: '10px',
                      borderLeft: '3px solid #00d4ff',
                    }}
                  >
                    <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>
                      👤 {proposal.freelancerId?.name || 'Freelancer'}
                    </p>
                    <p style={{ margin: '0 0 10px 0', color: '#aaa', fontSize: '13px' }}>
                      {proposal.proposalText}
                    </p>
                    <p style={{ margin: '0', fontWeight: 'bold', color: '#00d4ff' }}>
                      💰 Bid: ₹{proposal.bidAmount}
                    </p>
                  </div>
                ))
              ) : (
                <p style={{ color: '#aaa' }}>No proposals yet</p>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN - CLIENT & PROPOSAL FORM */}
          <div>
            {/* CLIENT INFO */}
            <div
              style={{
                backgroundColor: '#1a2a4a',
                border: '2px solid #00d4ff',
                padding: '20px',
                borderRadius: '10px',
                marginBottom: '20px',
              }}
            >
              <h3 style={{ color: '#00d4ff', marginTop: '0' }}>👤 Client</h3>
              <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>
                {job.postedBy?.name || 'Client'}
              </p>
              <p style={{ margin: '0', fontSize: '13px', color: '#aaa' }}>
                📧 {job.postedBy?.email || 'N/A'}
              </p>
              {job.postedBy?.rating && (
                <p style={{ margin: '5px 0 0 0', fontSize: '13px' }}>
                  ⭐ Rating: {job.postedBy.rating}
                </p>
              )}
            </div>

            {/* SUBMIT PROPOSAL FORM */}
            <div
              style={{
                backgroundColor: '#1a2a4a',
                border: '2px solid #00d4ff',
                padding: '20px',
                borderRadius: '10px',
              }}
            >
              <h3 style={{ color: '#00d4ff', marginTop: '0' }}>📤 Submit Proposal</h3>

              <form onSubmit={handleSubmitProposal}>
                {/* BID AMOUNT */}
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '13px' }}>
                    Your Bid (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="Enter your bid amount"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
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

                {/* PROPOSAL TEXT */}
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '13px' }}>
                    Your Proposal
                  </label>
                  <textarea
                    placeholder="Explain why you are the best fit..."
                    value={proposalText}
                    onChange={(e) => setProposalText(e.target.value)}
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
                  {submitting ? '⏳ SUBMITTING...' : '📤 SUBMIT PROPOSAL'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;