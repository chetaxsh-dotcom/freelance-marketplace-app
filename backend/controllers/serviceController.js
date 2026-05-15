import Service from '../models/Service.js';

export const createService = async (req, res) => {
  try {
    const { title, description, price, skills, location, image, userId } = req.body;
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?._id || user?.id;


    const newService = new Service({
      title,
      description,
      price,
      skills,
      location,
      image,
      userId
    });

    await newService.save();
    res.status(201).json(newService);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getServices = async (req, res) => {
  try {
    const { search, maxPrice, skill, location } = req.query;

    let query = {};

    if (search) {
      query.title = { $regex: `^${search}`, $options: 'i' };
    }

    if (maxPrice) {
      query.price = { $lte: Number(maxPrice) };
    }

    if (skill) {
      query.skills = { $elemMatch: { $regex: skill, $options: 'i' } };
    }

    if (location) {
      query.location = { $regex: `^${location}`, $options: 'i' };
    }

    const services = await Service.find(query);
    res.json(services);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addServiceRating = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { value, review } = req.body;
    const userId = req.user.id;

    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const existing = service.ratings.find(
      r => r.userId.toString() === userId
    );

    if (existing) {
      existing.value = value;
      existing.review = review;
    } else {
      service.ratings.push({ userId, value, review });
    }

    const total = service.ratings.reduce((sum, r) => sum + r.value, 0);
    service.averageRating = total / service.ratings.length;

    await service.save();

    res.json(service);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};