import express from 'express';
import { registerUser, loginUser, changePassword, forgotPassword } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.patch("/change-password",changePassword);
router.patch("/forgot-password", forgotPassword);

export default router;