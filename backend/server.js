import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// LOG ENV
console.log('\n🔐 Environment Variables Check:');
console.log('  PORT:', process.env.PORT || '5000');
console.log('  MONGO_URI:', process.env.MONGO_URI ? '✅ Set' : '❌ Missing');
console.log('  JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');
console.log('  RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID ? `✅ Set (${process.env.RAZORPAY_KEY_ID.length} chars)` : '❌ Missing');
console.log('  RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET ? '✅ Set' : '❌ Missing');
console.log('');

// IMPORT ROUTES
import authRoutes from './routes/authRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import cleanupRoutes from './routes/cleanupRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import contractRoutes from './routes/contractRoutes.js';    

// USE ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/cleanup', cleanupRoutes);
app.use('/api/jobs', jobRoutes);  
app.use('/api/contracts', contractRoutes);  

// DATABASE
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected\n'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});