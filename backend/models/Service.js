import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    skills: String,  // ← Can be string or array
    location: String,
    image: String,
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false  // ← Allow null for now
    },
    averageRating: {
      type: Number,
      default: 0
    },
    ratings: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        value: {
          type: Number,
          min: 1,
          max: 5,
          required: true
        },
        review: {
          type: String,
          required: true
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  { timestamps: true }
);

const Service = mongoose.model('Service', serviceSchema);

export default Service;