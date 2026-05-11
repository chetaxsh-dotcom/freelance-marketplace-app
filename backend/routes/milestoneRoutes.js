import express from 'express';
import {
  createMilestone,
  getMilestones,
  updateMilestoneStatus,
  releaseMilestonePayment
} from '../controllers/milestoneController.js';

const router = express.Router();

router.post('/create', createMilestone);
router.get('/:jobId', getMilestones);
router.patch('/:milestoneId/status', updateMilestoneStatus);
router.patch('/:milestoneId/release', releaseMilestonePayment);

export default router;