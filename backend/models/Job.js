import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    budget: {
      type: Number,
      required: true
    },
    duration: {
      type: String,
      enum: ['1 week', '2 weeks', '1 month', '2 months', '3+ months'],
      default: '1 month'
    },
    category: {
      type: String,
      required: false
    },
    status: {
      type: String,
      enum: ['open', 'assigned', 'in-progress', 'completed', 'cancelled'],
      default: 'open'
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    image: String,
    attachments: [
      {
        name: String,
        url: String
      }
    ],
    ratings: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      value: { type: Number, min: 1, max: 5 },
      review: String,
      response: String
    }
  ],

  averageRating: {
    type: Number,
    default: 0
  }

  },
  { timestamps: true }
);

const Job = mongoose.model('Job', jobSchema);

export default Job;