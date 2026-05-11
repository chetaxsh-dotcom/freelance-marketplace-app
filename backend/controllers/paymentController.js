import Payment from '../models/Payment.js';
import crypto from 'crypto';
import axios from 'axios';
import Notification from "../models/Notification.js";

console.log(' Payment Controller Loaded');


// CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    const { amount, jobId, freelancerId, clientId, description } = req.body;

    //  VALIDATION
    if (!amount || !jobId || !freelancerId || !clientId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      throw new Error('Razorpay keys missing in .env');
    }

    //  USE AXIOS (STABLE)
    const response = await axios.post(
      'https://api.razorpay.com/v1/orders',
      {
        amount: amount * 100,
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

    //  SAVE ONLY AFTER SUCCESS
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

    res.json({
      success: true,
      order,
      keyId
    });

  } catch (error) {
    console.error('❌ Create Order Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// VERIFY PAYMENT
export const verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    const body = razorpayOrderId + "|" + razorpayPaymentId;

    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid signature'
      });
    }

    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId },
      {
        razorpayPaymentId,
        razorpaySignature,
        status: 'completed'
      },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found"
      });
    }

    //  ADD NOTIFICATION HERE (CORRECT PLACE)
    await Notification.create({
      userId: payment.clientId, // or clientId (your choice)
      message: `💰 You received ₹${payment.jobId} payment`
    });

    res.json({
      success: true,
      message: 'Payment verified',
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

// PAYMENT HISTORY
export const getPaymentHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const payments = await Payment.find({
      $or: [
        { freelancerId: userId },
        { clientId: userId }
      ]
    }).sort({ createdAt: -1 });

    res.json(payments);

  } catch (error) {
    console.error('❌ History Error:', error.message);
    res.status(500).json({
      message: error.message
    });
  }
};