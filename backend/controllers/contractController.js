import Contract from '../models/Contract.js';
import Job from '../models/Job.js';

// CREATE CONTRACT
export const createContract = async (req, res) => {
  try {
    const { jobId, freelancerId, clientId, title, description, budget, deadline } = req.body;

    console.log('📋 Creating Contract:', { jobId, freelancerId, clientId });

    if (!jobId || !freelancerId || !clientId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: jobId, freelancerId, clientId'
      });
    }

    if (clientId === freelancerId) {
      return res.status(400).json({
        success: false,
        message: 'Client and freelancer cannot be the same'
      });
    }

    // Check if contract already exists
    const existingContract = await Contract.findOne({ jobId, freelancerId });
    if (existingContract) {
      return res.status(400).json({
        success: false,
        message: 'Contract already exists for this job and freelancer'
      });
    }

    const contract = new Contract({
      jobId,
      clientId,
      freelancerId,
      title: title || 'New Contract',
      description,
      budget,
      deadline,
      status: 'pending',
      messages: [],
      milestones: []
    });

    await contract.save();
    await contract.populate([
      { path: 'jobId', select: 'title' },
      { path: 'clientId', select: 'name email' },
      { path: 'freelancerId', select: 'name email' }
    ]);

    console.log('✅ Contract created:', contract._id);

    res.status(201).json({
      success: true,
      message: 'Contract created successfully',
      contract
    });

  } catch (error) {
    console.error('❌ Create Contract Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create contract'
    });
  }
};

// GET ALL CONTRACTS FOR USER
export const getUserContracts = async (req, res) => {
  try {
    const { userId } = req.params;

    console.log('📋 Fetching contracts for user:', userId);

    const contracts = await Contract.find({
      $or: [
        { clientId: userId },
        { freelancerId: userId }
      ]
    })
      .populate('jobId', 'title budget')
      .populate('clientId', 'name email')
      .populate('freelancerId', 'name email')
      .sort({ createdAt: -1 });

    console.log('✅ Contracts found:', contracts.length);

    res.status(200).json(contracts);

  } catch (error) {
    console.error('❌ Get Contracts Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET CONTRACT BY ID
export const getContractById = async (req, res) => {
  try {
    const { id } = req.params;

    const contract = await Contract.findById(id)
      .populate('jobId')
      .populate('clientId', 'name email rating')
      .populate('freelancerId', 'name email rating')
      .populate('messages.senderId', 'name');

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: 'Contract not found'
      });
    }

    console.log('✅ Contract fetched:', id);

    res.status(200).json(contract);

  } catch (error) {
    console.error('❌ Get Contract Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE CONTRACT STATUS
export const updateContractStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'accepted', 'rejected', 'in-progress', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const contract = await Contract.findByIdAndUpdate(
      id,
      {
        status,
        startDate: status === 'accepted' ? new Date() : undefined
      },
      { new: true }
    )
      .populate('jobId')
      .populate('clientId', 'name email')
      .populate('freelancerId', 'name email');

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: 'Contract not found'
      });
    }

    console.log('✅ Contract status updated:', id, status);

    res.status(200).json({
      success: true,
      message: 'Contract updated successfully',
      contract
    });

  } catch (error) {
    console.error('❌ Update Contract Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ADD MESSAGE TO CONTRACT
export const addMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { senderId, message } = req.body;

    const contract = await Contract.findById(id);

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: 'Contract not found'
      });
    }

    contract.messages.push({
      senderId,
      message,
      createdAt: new Date()
    });

    await contract.save();
    await contract.populate('messages.senderId', 'name');

    console.log('✅ Message added');

    res.status(200).json({
      success: true,
      message: 'Message added',
      contract
    });

  } catch (error) {
    console.error('❌ Add Message Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE CONTRACT
export const deleteContract = async (req, res) => {
  try {
    const { id } = req.params;

    const contract = await Contract.findByIdAndDelete(id);

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: 'Contract not found'
      });
    }

    console.log('✅ Contract deleted:', id);

    res.status(200).json({
      success: true,
      message: 'Contract deleted successfully'
    });

  } catch (error) {
    console.error('❌ Delete Contract Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};