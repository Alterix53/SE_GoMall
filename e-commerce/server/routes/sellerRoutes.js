import express from 'express';
import {
  registerSeller,
  getAllSellers,
  approveSeller,
  rejectSeller
} from '../controllers/sellerController.js';

const router = express.Router();

router.post('/register', registerSeller);
router.get('/', getAllSellers);
router.patch('/approve/:id', approveSeller);
router.patch('/reject/:id', rejectSeller);

export default router;
