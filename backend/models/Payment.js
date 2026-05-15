import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    orderId: String,
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job'
    },
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    amount: Number,
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    refundId: String,
    description: String,
    completedAt: Date
  },
  { timestamps: true }
);

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;