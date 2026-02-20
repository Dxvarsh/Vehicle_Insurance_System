import express from 'express';
import {
  submitClaim,
  getAllClaims,
  getMyClaims,
  getClaimById,
  processClaim,
  getClaimStats
} from '../controllers/claimController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { submitClaimValidator, processClaimValidator } from '../validators/claimValidator.js';
import validate from '../middleware/validate.js';

const router = express.Router();

router.use(protect);

// ── Customer Routes ──
router.post('/', authorize('Customer'), submitClaimValidator, validate, submitClaim);
router.get('/my', authorize('Customer'), getMyClaims);

// ── Admin/Staff Routes ──
router.get('/', authorize('Admin', 'Staff'), getAllClaims);
router.get('/stats', authorize('Admin', 'Staff'), getClaimStats);

// ── Protected Detail Route ──
router.get('/:id', getClaimById);

// ── Admin Action Routes ──
router.put('/:id/process', authorize('Admin'), processClaimValidator, validate, processClaim);

export default router;
