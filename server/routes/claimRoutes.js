import express from 'express';
import {
  submitClaim,
  getAllClaims,
  getMyClaims,
  getClaimById,
  approveClaim,
  rejectClaim,
  reviewClaim
} from '../controllers/claimController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', authorize('Customer'), submitClaim);
router.get('/', authorize('Admin', 'Staff'), getAllClaims);
router.get('/my', authorize('Customer'), getMyClaims);
router.get('/:id', authorize('Admin', 'Staff', 'Customer'), getClaimById);
router.put('/:id/approve', authorize('Admin'), approveClaim);
router.put('/:id/reject', authorize('Admin'), rejectClaim);
router.put('/:id/review', authorize('Admin'), reviewClaim);

export default router;
