import Milestone from '../models/Milestone.js';
import Payment from '../models/Payment.js';

// CREATE MILESTONE
export const createMilestone = async (req, res) => {
  try {
    const { jobId, title, description, amount, dueDate } = req.body;

    const milestone = new Milestone({
      jobId,
      title,
      description,
      amount,
      dueDate,
      createdBy: req.user?.id || 'client123'
    });

    await milestone.save();

    res.json({
      success: true,
      message: 'Milestone created',
      milestone
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET MILESTONES FOR JOB
export const getMilestones = async (req, res) => {
  try {
    const { jobId } = req.params;

    const milestones = await Milestone.find({ jobId }).sort({ dueDate: 1 });

    res.json(milestones);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE MILESTONE STATUS
export const updateMilestoneStatus = async (req, res) => {
  try {
    const { milestoneId } = req.params;
    const { status } = req.body;

    const milestone = await Milestone.findByIdAndUpdate(
      milestoneId,
      { status },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Milestone updated',
      milestone
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// RELEASE PAYMENT (Mark as completed)
export const releaseMilestonePayment = async (req, res) => {
  try {
    const { milestoneId } = req.params;

    const milestone = await Milestone.findByIdAndUpdate(
      milestoneId,
      {
        status: 'released',
        releaseDate: new Date()
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Payment released',
      milestone
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};