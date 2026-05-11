import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Job from './models/Job.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const seedJob = async () => {
  const job = new Job({
    title: "Seeded Job",
    description: "This job was seeded for testing",
    budget: 500,
    duration: "1 week",
    category: "Testing",
    postedBy: "someUserId"
  });
  await job.save();
  console.log("Seeded job:", job._id);
  process.exit();
};

seedJob();
