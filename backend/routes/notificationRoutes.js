import express from "express";
import Notification from "../models/Notification.js";

const router = express.Router();


// GET ALL NOTIFICATIONS
router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 });

    res.json(notifications);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// CREATE NOTIFICATION
router.post("/", async (req, res) => {
  try {
    const notif = await Notification.create(req.body);

    res.json(notif);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;