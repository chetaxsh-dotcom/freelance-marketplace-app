import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import serviceRoutes from './routes/serviceRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import authRoutes from './routes/authRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import milestoneRoutes from './routes/milestoneRoutes.js';
import notificationRoutes from "./routes/notificationRoutes.js";
import contractRoutes from "./routes/contractRoutes.js";



const app = express();

connectDB();

app.use(express.json());

app.use(cors({
  origin: "*",
  credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/milestones",milestoneRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/contracts", contractRoutes);

app.get("/", (req, res) => {
  res.send("API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});