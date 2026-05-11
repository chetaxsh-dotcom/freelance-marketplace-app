import express from "express";
import { createJob, getJobs, getJobById, addRating, addResponse, } from "../controllers/jobController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", createJob);
router.get("/", getJobs);
router.get("/:jobId", getJobById);

// protected route
router.post("/:jobId/rate",authMiddleware, addRating);
router.post("/:jobId/respond/:ratingId", addResponse);

export default router;