import { useState } from 'react';
import API from '../api/api';

const PaymentButton = ({ amount, jobId, freelancerId, serviceName }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);

      // ✅ DEBUG: Check localStorage
      console.log('🔍 Checking localStorage...');
      const userStr = localStorage.getItem('user');
      console.log('📦 Raw user string:', userStr);

      if (!userStr) {
        console.error('❌ NO USER IN LOCALSTORAGE');
        alert('❌ Please login first');
        window.location.href = '/login';
        return;
      }

      const user = JSON.parse(userStr);
      console.log('👤 Parsed user object:', user);

      // Try multiple ways to get ID
      const clientId = user._id || user.id || localStorage.getItem('userId');
      console.log('🆔 ClientId found:', clientId);

      if (!clientId) {
        console.error('❌ NO CLIENTID FOUND');
        alert('❌ User ID not found. Please login again');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }

      console.log('📝 PAYMENT DATA:', { amount, jobId, freelancerId, clientId });

      // ✅ VALIDATION
      if (!clientId) {
        alert('❌ Please login first');
        return;
      }

      if (!freelancerId || freelancerId === 'unknown') {
        console.error('❌ FREELANCERID MISSING:', freelancerId);
        alert('❌ Freelancer ID missing. Service may not be properly posted');
        return;
      }

      if (clientId === freelancerId) {
        alert('❌ You cannot pay for your own service!');
        return;
      }

      if (!amount || amount <= 0) {
        alert('❌ Invalid amount');
        return;
      }

      // CREATE ORDER
      console.log('🚀 Calling create-order API...');
      const { data } = await API.post('/payments/create-order', {
        amount,
        jobId,
        freelancerId,
        clientId,
        description: `Payment for ${serviceName || 'Service'}`
      });

      console.log('✅ ORDER CREATED:', data.order.id);

      const { order, keyId } = data;

      // RAZORPAY OPTIONS
      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Freelance Marketplace',
        description: `Payment for ${serviceName || 'Service'}`,
        order_id: order.id,

        handler: async function (response) {
          try {
            console.log('💳 PAYMENT RESPONSE:', response);

            const verifyRes = await API.post('/payments/verify', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            });

            if (verifyRes.data.success) {
              console.log('✅ PAYMENT VERIFIED');
              alert('✅ Payment Successful!');
              
              setTimeout(() => {
                window.location.href = '/payments';
              }, 1000);
            }

          } catch (err) {
            console.error('❌ VERIFY ERROR:', err.response?.data || err);
            alert('❌ Payment verification failed: ' + (err.response?.data?.message || err.message));
          }
        },

        modal: {
          ondismiss: function() {
            console.log('❌ User cancelled payment');
            alert('❌ Payment cancelled');
          }
        },

        prefill: {
          name: user?.name || 'User',
          email: user?.email || 'user@email.com'
        },

        theme: {
          color: '#28a745'
        }
      };

      if (!window.Razorpay) {
        alert('❌ Razorpay not loaded');
        return;
      }

      console.log('🎉 Opening Razorpay modal');
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error('❌ PAYMENT ERROR:', err.response?.data || err);
      alert(err.response?.data?.message || '❌ Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      style={{
        padding: '12px 20px',
        background: loading ? '#cccccc' : '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: loading ? 'not-allowed' : 'pointer',
        width: '100%',
        fontWeight: 'bold',
        fontSize: '16px',
        opacity: loading ? 0.6 : 1,
        transition: 'all 0.3s'
      }}
    >
      {loading ? '⏳ Processing...' : `💳 Pay ₹${amount}`}
    </button>
  );
};

export default PaymentButton;