import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: String,
    amount: {
      type: Number,
      required: true
    },
    dueDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'released'],
      default: 'pending'
    },
    paymentId: mongoose.Schema.Types.ObjectId,
    releaseDate: Date,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

const Milestone = mongoose.model('Milestone', milestoneSchema);

export default Milestone;