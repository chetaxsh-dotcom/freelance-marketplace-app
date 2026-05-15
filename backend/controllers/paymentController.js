import Payment from '../models/Payment.js';
import crypto from 'crypto';
import axios from 'axios';
import Notification from '../models/Notification.js';

console.log(' Payment Controller Loaded');

// CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    const { amount, jobId, freelancerId, clientId, description } = req.body;

    console.log('📝 Creating order:', { amount, jobId, freelancerId, clientId });

    // VALIDATION
    if (!amount || !jobId || !freelancerId || !clientId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: amount, jobId, freelancerId, clientId'
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than 0'
      });
    }

    // GET RAZORPAY KEYS
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.error('❌ Razorpay keys missing');
      return res.status(500).json({
        success: false,
        message: 'Razorpay keys not configured'
      });
    }

    console.log('🔑 Using Razorpay keys:', { keyId: keyId.substring(0, 10) + '...' });

    // CREATE RAZORPAY ORDER
    console.log('🚀 Calling Razorpay API...');
    const response = await axios.post(
      'https://api.razorpay.com/v1/orders',
      {
        amount: amount * 100, // Convert to paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        notes: {
          jobId,
          freelancerId,
          clientId
        }
      },
      {
        auth: {
          username: keyId,
          password: keySecret
        }
      }
    );

    const order = response.data;
    console.log('✅ Razorpay order created:', order.id);

    // SAVE PAYMENT RECORD
    const payment = await Payment.create({
      orderId: order.id,
      jobId,
      freelancerId,
      clientId,
      amount,
      status: 'pending',
      razorpayOrderId: order.id,
      description
    });

    console.log('✅ Payment record saved:', payment._id);

    // SEND SUCCESS RESPONSE
    res.json({
      success: true,
      order,
      keyId
    });

  } catch (error) {
    console.error('❌ Create Order Error:', error.message);
    
    // HANDLE RAZORPAY ERRORS
    if (error.response?.data) {
      console.error('Razorpay error:', error.response.data);
      return res.status(error.response.status).json({
        success: false,
        message: error.response.data.error?.description || error.message
      });
    }

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// VERIFY PAYMENT (FIXED)
export const verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    console.log('🔍 Verifying payment:', razorpayOrderId);

    // VALIDATION
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: 'Missing verification data'
      });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      return res.status(500).json({
        success: false,
        message: 'Razorpay key secret not configured'
      });
    }

    // VERIFY SIGNATURE
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body)
      .digest('hex');

    console.log('🔐 Signature verification:', {
      expected: expectedSignature.substring(0, 10) + '...',
      received: razorpaySignature.substring(0, 10) + '...'
    });

    if (expectedSignature !== razorpaySignature) {
      console.error('❌ Signature mismatch');
      return res.status(400).json({
        success: false,
        message: 'Invalid signature - payment tampering detected'
      });
    }

    // FIND PAYMENT RECORD FIRST
    const payment = await Payment.findOne({ razorpayOrderId });

    if (!payment) {
      console.error('❌ Payment record not found:', razorpayOrderId);
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }

    console.log('✅ Payment found:', { 
      paymentId: payment._id, 
      clientId: payment.clientId,
      amount: payment.amount 
    });

    // UPDATE PAYMENT RECORD
    payment.razorpayPaymentId = razorpayPaymentId;
    payment.razorpaySignature = razorpaySignature;
    payment.status = 'completed';
    payment.completedAt = new Date();
    
    await payment.save();

    console.log('✅ Payment updated:', payment._id);

    // CREATE NOTIFICATION (WITH VALIDATION)
    if (payment.clientId) {
      try {
        console.log('📢 Creating notification for clientId:', payment.clientId);
        
        const notification = await Notification.create({
          userId: payment.clientId,
          message: `💰 Payment of ₹${payment.amount} completed for Job ${payment.jobId}`,
          type: 'payment',
          read: false
        });
        
        console.log('✅ Notification created:', notification._id);
      } catch (notifErr) {
        console.error('⚠️ Notification creation failed:', notifErr.message);
        // Don't fail payment verification for notification error
      }
    } else {
      console.warn('⚠️ No clientId found for notification');
    }

    // ALSO CREATE NOTIFICATION FOR FREELANCER
    if (payment.freelancerId) {
      try {
        console.log('📢 Creating notification for freelancerId:', payment.freelancerId);
        
        const notif = await Notification.create({
          userId: payment.freelancerId,
          message: `💸 You received ₹${payment.amount} payment for Job ${payment.jobId}`,
          type: 'payment',
          read: false
        });
        
        console.log('✅ Freelancer notification created:', notif._id);
      } catch (err) {
        console.error('⚠️ Freelancer notification failed:', err.message);
      }
    }

    // SEND SUCCESS RESPONSE
    res.json({
      success: true,
      message: 'Payment verified successfully',
      payment
    });

  } catch (error) {
    console.error('❌ Verify Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET PAYMENT HISTORY
export const getPaymentHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    console.log('📋 Fetching payment history for user:', userId);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID required'
      });
    }

    const payments = await Payment.find({
      $or: [
        { freelancerId: userId },
        { clientId: userId }
      ]
    })
      .populate('jobId', 'title')
      .sort({ createdAt: -1 });

    console.log(`✅ Found ${payments.length} payments`);

    res.json(payments);

  } catch (error) {
    console.error('❌ History Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET SINGLE PAYMENT
export const getPaymentById = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findById(paymentId)
      .populate('jobId')
      .populate('freelancerId', 'name email')
      .populate('clientId', 'name email');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.json(payment);

  } catch (error) {
    console.error('❌ Get Payment Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// REFUND PAYMENT
export const refundPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    if (payment.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Only completed payments can be refunded'
      });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // CREATE REFUND VIA RAZORPAY
    const refundResponse = await axios.post(
      `https://api.razorpay.com/v1/payments/${payment.razorpayPaymentId}/refund`,
      {
        amount: payment.amount * 100
      },
      {
        auth: {
          username: keyId,
          password: keySecret
        }
      }
    );

    // UPDATE PAYMENT STATUS
    payment.status = 'refunded';
    payment.refundId = refundResponse.data.id;
    await payment.save();

    console.log('✅ Payment refunded:', payment._id);

    res.json({
      success: true,
      message: 'Payment refunded successfully',
      payment
    });

  } catch (error) {
    console.error('❌ Refund Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};