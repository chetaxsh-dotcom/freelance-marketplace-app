import Job from '../models/Job.js';

// CREATE JOB
export const createJob = async (req, res) => {
  try {
    const { title, description, budget, duration, category, skills, location } = req.body;

    console.log('📋 Creating Job:', { title, budget });

    const user = JSON.parse(JSON.stringify(req.user || {})) || {};
    const userId = user._id || req.body.postedBy;

    if (!title || !description || !budget) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, description, budget'
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID required. Please login first.'
      });
    }

    const job = new Job({
      title,
      description,
      budget: Number(budget),
      duration: duration || '1 month',
      category: category || 'Other',
      skills: Array.isArray(skills) ? skills : skills?.split(',').map(s => s.trim()) || [],
      location: location || 'Remote',
      postedBy: userId,
      status: 'open',
      proposals: [],
      ratings: [],
      averageRating: 0
    });

    await job.save();
    await job.populate('postedBy', 'name email');

    console.log('✅ Job created:', job._id);

    res.status(201).json({
      success: true,
      message: 'Job posted successfully',
      job
    });

  } catch (error) {
    console.error('❌ Create Job Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create job'
    });
  }
};

// GET ALL JOBS
export const getAllJobs = async (req, res) => {
  try {
    console.log('📋 Fetching all jobs');

    const jobs = await Job.find({ status: { $ne: 'cancelled' } })
      .populate('postedBy', 'name email rating')
      .populate('assignedTo', 'name email rating')
      .sort({ createdAt: -1 });

    console.log('✅ Jobs fetched:', jobs.length);

    res.status(200).json(jobs);

  } catch (error) {
    console.error('❌ Get Jobs Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET JOB BY ID
export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id)
      .populate('postedBy', 'name email rating')
      .populate('assignedTo', 'name email rating')
      .populate('proposals.freelancerId', 'name email rating');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    console.log('✅ Job found:', id);

    res.status(200).json(job);

  } catch (error) {
    console.error('❌ Get Job Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE JOB
export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const job = await Job.findByIdAndUpdate(id, updates, { new: true })
      .populate('postedBy', 'name email')
      .populate('assignedTo', 'name email');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    console.log('✅ Job updated:', id);

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      job
    });

  } catch (error) {
    console.error('❌ Update Job Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE JOB
export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findByIdAndDelete(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    console.log('✅ Job deleted:', id);

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully'
    });

  } catch (error) {
    console.error('❌ Delete Job Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// SEARCH JOBS
export const searchJobs = async (req, res) => {
  try {
    const { search, category, budget, duration } = req.query;

    let filter = { status: { $ne: 'cancelled' } };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category && category !== 'all') filter.category = category;
    if (duration && duration !== 'all') filter.duration = duration;
    if (budget) filter.budget = { $lte: parseInt(budget) };

    const jobs = await Job.find(filter)
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 });

    console.log('✅ Search found:', jobs.length);

    res.status(200).json(jobs);

  } catch (error) {
    console.error('❌ Search Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ADD PROPOSAL
export const addProposal = async (req, res) => {
  try {
    const { id } = req.params;
    const { freelancerId, proposalText, bidAmount } = req.body;

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    job.proposals.push({
      freelancerId,
      proposalText,
      bidAmount,
      status: 'pending'
    });

    await job.save();
    console.log('✅ Proposal added');

    res.status(200).json({
      success: true,
      message: 'Proposal submitted',
      job
    });

  } catch (error) {
    console.error('❌ Proposal Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ADD RATING
export const addRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, value, review } = req.body;

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    job.ratings.push({
      userId,
      value,
      review,
      createdAt: new Date()
    });

    const total = job.ratings.reduce((sum, r) => sum + r.value, 0);
    job.averageRating = Number((total / job.ratings.length).toFixed(1));

    await job.save();
    console.log('✅ Rating added');

    res.status(200).json({
      success: true,
      message: 'Rating added',
      job
    });

  } catch (error) {
    console.error('❌ Rating Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};