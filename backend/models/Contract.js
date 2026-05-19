import mongoose from 'mongoose';

const contractSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: String,
    description: String,
    budget: Number,
    deadline: Date,
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'in-progress', 'completed', 'cancelled'],
      default: 'pending'
    },
    startDate: Date,
    endDate: Date,
    milestones: [
      {
        title: String,
        description: String,
        amount: Number,
        dueDate: Date,
        status: {
          type: String,
          enum: ['pending', 'completed'],
          default: 'pending'
        }
      }
    ],
    messages: [
      {
        senderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        message: String,
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    rating: {
      byFreelancer: {
        value: Number,
        review: String
      },
      byClient: {
        value: Number,
        review: String
      }
    }
  },
  { timestamps: true }
);

const Contract = mongoose.model('Contract', contractSchema);

export default Contract;