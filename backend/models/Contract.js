import mongoose from "mongoose";

const contractSchema = new mongoose.Schema({

  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service"
  },

  proposal: {
    type: String,
    required: true
  },

  amount: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    default: "active"
  }

}, { timestamps: true });

export default mongoose.model(
  "Contract",
  contractSchema
);