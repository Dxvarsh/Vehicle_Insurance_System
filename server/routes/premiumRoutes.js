import express from 'express';
import {
  getAllPremiums,
  getMyPremiums,
  processPayment,
  getPaymentReceipt
} from '../controllers/premiumController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', authorize('Admin', 'Staff'), getAllPremiums);
router.get('/my', authorize('Customer'), getMyPremiums);
router.put('/:id/pay', authorize('Customer'), processPayment);
router.get('/:id/receipt', authorize('Customer', 'Admin', 'Staff'), getPaymentReceipt);

export default router;
