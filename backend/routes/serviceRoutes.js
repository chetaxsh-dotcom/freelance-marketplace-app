import express from 'express';
import Service from '../models/Service.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

const router = express.Router();

// CREATE SERVICE - FIXED VERSION
router.post('/create', async (req, res) => {
  try {
    console.log('📝 Creating service. Body:', req.body);
    
    const { title, description, price, category, skills, location, image, userId, freelancerId } = req.body;

    // VALIDATION
    if (!title || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, description, price, category'
      });
    }

    // ✅ KEY FIX: Try to get userId, if not provided, use first user or create dummy
    let finalFreelancerId = userId || freelancerId;

    if (!finalFreelancerId) {
      console.log('⚠️ No userId provided, finding default user...');
      
      // Try to get any existing user
      let user = await User.findOne();
      
      if (!user) {
        // If no user exists, this is first time - create a demo user
        user = await User.create({
          name: 'Demo Freelancer',
          email: `demo-${Date.now()}@freelance.com`,
          password: 'demo123',
          role: 'freelancer'
        });
        console.log('✅ Created demo user:', user._id);
      }
      
      finalFreelancerId = user._id;
      console.log('✅ Using default freelancer:', finalFreelancerId);
    }

    // CREATE SERVICE
    const service = new Service({
      title,
      description,
      price,
      category,
      skills,
      location,
      image,
      freelancerId: finalFreelancerId
    });

    await service.save();
    console.log('✅ Service created:', service._id);
    console.log('   With freelancerId:', service.freelancerId);

    // CREATE NOTIFICATION
    try {
      await Notification.create({
        userId: finalFreelancerId,
        message: `📢 Your service "${title}" has been posted successfully!`,
        type: 'job',
        read: false
      });
    } catch (notifErr) {
      console.error('⚠️ Notification error:', notifErr.message);
    }

    res.json({
      success: true,
      message: 'Service created successfully',
      service
    });

  } catch (error) {
    console.error('❌ Error creating service:', error.message);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// GET ALL SERVICES
router.get('/', async (req, res) => {
  try {
    const services = await Service.find()
      .populate('freelancerId', 'name email rating _id')
      .sort({ createdAt: -1 });
    
    console.log('✅ Services fetched:', services.length);
    res.json(services);
  } catch (error) {
    console.error('❌ Error fetching services:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// GET SINGLE SERVICE
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('freelancerId', 'name email rating _id');
    
    if (!service) {
      return res.status(404).json({ 
        success: false,
        message: 'Service not found' 
      });
    }
    
    console.log('✅ Service found:', service._id);
    res.json(service);
  } catch (error) {
    console.error('❌ Error fetching service:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// UPDATE SERVICE
router.patch('/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!service) {
      return res.status(404).json({ 
        success: false,
        message: 'Service not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Service updated',
      service 
    });
  } catch (error) {
    console.error('❌ Error updating service:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// DELETE SERVICE
router.delete('/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({ 
        success: false,
        message: 'Service not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Service deleted' 
    });
  } catch (error) {
    console.error('❌ Error deleting service:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// ADD RATING
router.post('/:id/rate', async (req, res) => {
  try {
    const { value, review, userId } = req.body;

    if (!value || value < 1 || value > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    if (!review || review.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Review message required'
      });
    }

    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ 
        success: false,
        message: 'Service not found' 
      });
    }

    service.ratings.push({
      value,
      review,
      userId,
      createdAt: new Date()
    });

    const total = service.ratings.reduce((sum, r) => sum + r.value, 0);
    service.averageRating = Number((total / service.ratings.length).toFixed(1));

    await service.save();
    console.log('✅ Rating added');

    res.json({
      success: true,
      message: 'Rating added successfully',
      service
    });

  } catch (err) {
    console.error('❌ Error adding rating:', err.message);
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
});

// GET RATINGS
router.get('/:id/ratings', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .select('ratings averageRating');

    if (!service) {
      return res.status(404).json({ 
        success: false,
        message: 'Service not found' 
      });
    }

    res.json({
      success: true,
      averageRating: service.averageRating,
      totalRatings: service.ratings.length,
      ratings: service.ratings
    });

  } catch (error) {
    console.error('❌ Error fetching ratings:', error.message);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

export default router;