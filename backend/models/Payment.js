import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    orderId: String,
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    
    freelancerId: String,
    clientId: String,
    jobId: String,
    serviceId: String,
    
    amount: Number,
    currency: { type: String, default: 'INR' },
    status: { 
      type: String, 
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    
    description: String,
  },
  { timestamps: true }
);

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;