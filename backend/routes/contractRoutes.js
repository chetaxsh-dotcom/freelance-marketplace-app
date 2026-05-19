import express from 'express';
import {
  createContract,
  getUserContracts,
  getContractById,
  updateContractStatus,
  addMessage,
  deleteContract
} from '../controllers/contractController.js';

const router = express.Router();

// CREATE CONTRACT
router.post('/', createContract);

// GET USER CONTRACTS
router.get('/user/:userId', getUserContracts);

// GET SINGLE CONTRACT
router.get('/:id', getContractById);

// UPDATE CONTRACT STATUS
router.patch('/:id/status', updateContractStatus);

// ADD MESSAGE
router.post('/:id/messages', addMessage);

// DELETE CONTRACT
router.delete('/:id', deleteContract);

export default router;