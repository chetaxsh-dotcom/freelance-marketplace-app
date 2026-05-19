import { useState } from 'react';
import API from '../api/api';

const PaymentButton = ({ amount, jobId, freelancerId, serviceName }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);

      console.log('🔍 Checking user...');
      const userStr = localStorage.getItem('user');

      if (!userStr) {
        alert('❌ Please login first');
        window.location.href = '/login';
        return;
      }

      const user = JSON.parse(userStr);
      const clientId = user._id;

      console.log('📊 Payment Details:', {
        clientId,
        freelancerId,
        amount,
        jobId
      });

      // VALIDATIONS
      if (!clientId) {
        alert('❌ User ID missing. Please login again');
        return;
      }

      if (!freelancerId) {
        alert('❌ Freelancer ID missing');
        return;
      }

      if (clientId === freelancerId) {
        alert('❌ You cannot pay for your own service!');
        return;
      }

      // CREATE ORDER
      console.log('🚀 Creating order...');

      const { data } = await API.post('/payments/create-order', {
        amount: parseInt(amount),
        jobId,
        freelancerId,
        clientId,
        description: `Payment for ${serviceName}`
      });

      console.log('✅ Order response:', data);

      if (!data.success) {
        alert('❌ ' + data.message);
        return;
      }

      const { order, keyId } = data;

      if (!window.Razorpay) {
        alert('❌ Razorpay not loaded');
        return;
      }

      // RAZORPAY OPTIONS
      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'FreelanceHub',
        description: serviceName,
        order_id: order.id,

        handler: async (response) => {
          try {
            console.log('💳 Payment response:', response);

            const verifyRes = await API.post('/payments/verify', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            });

            console.log('✅ Verify response:', verifyRes.data);

            if (verifyRes.data.success) {
              alert('✅ PAYMENT SUCCESSFUL!\n₹' + amount + ' received');
              setTimeout(() => {
                window.location.href = '/payments';
              }, 1500);
            } else {
              alert('❌ ' + verifyRes.data.message);
            }

          } catch (err) {
            console.error('❌ Verify error:', err);
            alert('❌ Payment verification failed');
          }
        },

        modal: {
          ondismiss: () => {
            console.log('User cancelled payment');
            alert('Payment cancelled');
          }
        },

        prefill: {
          name: user?.name,
          email: user?.email
        },

        theme: { color: '#00d4ff' }
      };

      console.log('🎯 Opening Razorpay...');
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error('❌ Error:', err);
      alert('❌ ' + (err.response?.data?.message || err.message));
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
        background: loading ? '#ccc' : 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
        color: loading ? '#999' : 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: loading ? 'not-allowed' : 'pointer',
        width: '100%',
        fontWeight: 'bold',
        fontSize: '14px',
        textTransform: 'uppercase'
      }}
    >
      {loading ? '⏳ PROCESSING...' : `💳 PAY ₹${amount}`}
    </button>
  );
};

export default PaymentButton;