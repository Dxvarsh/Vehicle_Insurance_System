import express from 'express';
import {
  submitRenewalRequest,
  getAllRenewals,
  getMyRenewals,
  getRenewalById,
  approveRenewal,
  rejectRenewal,
  getExpiringRenewals,
  sendRenewalReminder,
  markExpiredPolicies
} from '../controllers/renewalController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { submitRenewalValidator, processRenewalValidator } from '../validators/renewalValidator.js';
import validate from '../middleware/validate.js';

const router = express.Router();

router.use(protect);

router.post('/', authorize('Customer'), submitRenewalValidator, validate, submitRenewalRequest);
router.get('/', authorize('Admin', 'Staff'), getAllRenewals);
router.get('/my', authorize('Customer'), getMyRenewals);
router.get('/expiring', authorize('Admin', 'Staff'), getExpiringRenewals); 
router.put('/mark-expired', authorize('Admin'), markExpiredPolicies);

router.get('/:id', getRenewalById);
router.put('/:id/approve', authorize('Admin'), processRenewalValidator, validate, approveRenewal);
router.put('/:id/reject', authorize('Admin'), processRenewalValidator, validate, rejectRenewal);
router.post('/:id/remind', authorize('Admin', 'Staff'), sendRenewalReminder);

export default router;
