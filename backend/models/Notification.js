import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true  // ← REQUIRED!
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['payment', 'job', 'review', 'milestone'],
      default: 'payment'
    },
    read: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;