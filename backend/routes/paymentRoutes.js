import express from "express";
import {
  createOrder,
  verifyPayment,
  getPaymentHistory
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create-order", createOrder);
router.post("/verify", verifyPayment);   //  MUST EXIST
router.get("/history/:userId", getPaymentHistory);

export default router;