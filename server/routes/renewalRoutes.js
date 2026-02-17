import express from 'express';
import {
  submitRenewalRequest,
  getAllRenewals,
  getMyRenewals,
  getRenewalById,
  approveRenewal,
  rejectRenewal,
  getExpiringRenewals
} from '../controllers/renewalController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', authorize('Customer'), submitRenewalRequest);
router.get('/', authorize('Admin', 'Staff'), getAllRenewals);
router.get('/my', authorize('Customer'), getMyRenewals);
router.get('/expiring', authorize('Admin', 'Staff'), getExpiringRenewals); // Must be before /:id
router.get('/:id', getRenewalById);
router.put('/:id/approve', authorize('Admin'), approveRenewal);
router.put('/:id/reject', authorize('Admin'), rejectRenewal);

export default router;
