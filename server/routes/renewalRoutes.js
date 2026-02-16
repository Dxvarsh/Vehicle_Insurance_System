import express from 'express';
import {
  submitRenewalRequest,
  getAllRenewals,
  getMyRenewals,
  approveRenewal,
  rejectRenewal
} from '../controllers/renewalController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', authorize('Customer'), submitRenewalRequest);
router.get('/', authorize('Admin', 'Staff'), getAllRenewals);
router.get('/my', authorize('Customer'), getMyRenewals);
router.put('/:id/approve', authorize('Admin'), approveRenewal);
router.put('/:id/reject', authorize('Admin'), rejectRenewal);

export default router;
