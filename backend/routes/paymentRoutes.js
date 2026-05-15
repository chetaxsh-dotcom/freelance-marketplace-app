import express from 'express';
import {
  createOrder,
  verifyPayment,
  getPaymentHistory,
  getPaymentById,
  refundPayment
} from '../controllers/paymentController.js';

const router = express.Router();

// CREATE ORDER
router.post('/create-order', createOrder);

// VERIFY PAYMENT
router.post('/verify', verifyPayment);

// GET PAYMENT HISTORY
router.get('/history/:userId', getPaymentHistory);

// GET SINGLE PAYMENT
router.get('/:paymentId', getPaymentById);

// REFUND PAYMENT
router.post('/:paymentId/refund', refundPayment);

export default router;