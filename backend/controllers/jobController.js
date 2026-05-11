import Job from "../models/job.js"; 
import mongoose from "mongoose";
import Notification from "../models/Notification.js";

// CREATE JOB
export const createJob = async (req, res) => {
  try {
    const { title, description, budget, skills, duration, category } = req.body;

    if (!title || !description || !budget) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const job = new Job({
      title,
      description,
      budget,
      skills: skills || [],
      duration,
      category
    });

    await job.save();
    res.status(201).json(job);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL JOBS
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE JOB
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADD RATING

export const addRating = async (req, res) => {
  try {
    console.log("USER:", req.user);

    const { jobId } = req.params;
    const { value, review } = req.body;
    const userId = req.user.id;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const existing = job.ratings.find(
      r => r.userId.toString() === userId
    );

    if (existing) {
      existing.value = value;
      existing.review = review;
    } else {
      job.ratings.push({ userId, value, review });
    }

    // ⭐ Calculate average
    const total = job.ratings.reduce((sum, r) => sum + r.value, 0);
    job.averageRating = total / job.ratings.length;

    await job.save();

    // 🔔 CREATE NOTIFICATION (FIXED PLACE)
    await Notification.create({
      userId: job.createdBy || "unknown",
      message: `⭐ Your job "${job.title}" received a new rating`
    });

    res.json(job);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addResponse = async (req, res) => {
  try {
    const { jobId, ratingId } = req.params;
    const { response } = req.body;

    const job = await Job.findById(jobId);

    if (!job) return res.status(404).json({ message: "Job not found" });

    const rating = job.ratings.id(ratingId);

    if (!rating) return res.status(404).json({ message: "Rating not found" });

    rating.response = response;

    await job.save();

    res.json(job);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};