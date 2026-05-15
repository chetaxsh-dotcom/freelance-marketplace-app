import express from 'express';
import Service from '../models/Service.js';
import User from '../models/User.js';

const router = express.Router();

// FIX ALL SERVICES - Add freelancerId if missing
router.patch('/fix-services', async (req, res) => {
  try {
    console.log('🔧 Fixing all services...');

    // Get first user (admin/you)
    const firstUser = await User.findOne();

    if (!firstUser) {
      return res.status(400).json({
        success: false,
        message: 'No users in database. Please signup first.'
      });
    }

    console.log('👤 Using user:', firstUser._id);

    // Update all services without freelancerId
    const result = await Service.updateMany(
      { 
        $or: [
          { freelancerId: { $exists: false } },
          { freelancerId: null }
        ]
      },
      { $set: { freelancerId: firstUser._id } }
    );

    console.log(`✅ Fixed ${result.modifiedCount} services`);

    res.json({
      success: true,
      message: `Updated ${result.modifiedCount} services with freelancerId`,
      fixedCount: result.modifiedCount
    });

  } catch (error) {
    console.error('❌ Fix error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// DELETE ALL SERVICES (fresh start)
router.delete('/delete-all-services', async (req, res) => {
  try {
    const result = await Service.deleteMany({});
    console.log(`🗑️ Deleted ${result.deletedCount} services`);
    
    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} services`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;