import express from 'express';
import Service from '../models/Service.js';
import Notification from '../models/Notification.js';

const router = express.Router();

// CREATE SERVICE
router.post('/create', async (req, res) => {
  try {
    console.log(req.body);
    const { title, description, price, category, skills, location, image, freelancerId } = req.body;

    const service = new Service({
      title,
      description,
      price,
      category,
      skills,
      location,
      image,
      freelancerId: freelancerId ? freelancerId : undefined
    });

    await Notification.create({
        userId: freelancerId || null,
  message: `📢 New job posted: ${title}`
});

    await service.save();

    res.json({
      success: true,
      message: 'Service created',
      service
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET ALL SERVICES
router.get('/', async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET SINGLE SERVICE
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
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
    res.json({ success: true, service });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE SERVICE
router.delete('/:id', async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//  ADD RATING (IMPORTANT)

router.post('/:id/rate', async (req, res) => {
  try {
    const { value, review } = req.body;

    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    await Notification.create({
  userId: service.freelancerId,
  message: `⭐ New review received on ${service.title}`
});

    // rating add
    service.ratings.push({
      value,
      review
    });

    // average update
    const total = service.ratings.reduce((sum, r) => sum + r.value, 0);
    service.averageRating = total / service.ratings.length;

    await service.save();

    res.json({
      success: true,
      message: "Rating added",
      service
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;