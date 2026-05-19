import express from 'express';
import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  searchJobs,
  addProposal,
  addRating
} from '../controllers/jobController.js';

const router = express.Router();

// POST JOB
router.post('/', createJob);

// GET ALL JOBS
router.get('/', getAllJobs);

// SEARCH JOBS
router.get('/search', searchJobs);

// GET SINGLE JOB
router.get('/:id', getJobById);

// UPDATE JOB
router.patch('/:id', updateJob);

// DELETE JOB
router.delete('/:id', deleteJob);

// ADD PROPOSAL
router.post('/:id/proposals', addProposal);

// ADD RATING
router.post('/:id/ratings', addRating);

export default router;