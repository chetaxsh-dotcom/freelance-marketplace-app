import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
{
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },

  image: { type: String, default: "" },

  //  ADD THESE
  skills: [String],
  location: String,

  //  RATINGS
  ratings: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      value: Number,
      review: String
    }
  ],

  averageRating: { type: Number, default: 0 },

  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false
  }
},
{ timestamps: true }
);

const Service = mongoose.model("Service", serviceSchema);

export default Service; 