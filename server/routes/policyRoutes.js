import express from 'express';
import {
  createPolicy,
  getAllPolicies,
  getPolicyById,
  updatePolicy,
  togglePolicyStatus,
  purchasePolicy,
  calculatePremiumPreview,
  getPolicyStats,
} from '../controllers/policyController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import validate from '../middleware/validate.js';
import {
  createPolicyValidator,
  updatePolicyValidator,
  policyIdValidator,
  policyQueryValidator,
  purchasePolicyValidator,
  calculatePremiumValidator,
} from '../validators/policyValidator.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// ─────────────────────────────────────────────
// Static routes BEFORE :id routes
// ─────────────────────────────────────────────

// GET /api/policies/stats - Policy statistics (Admin, Staff)
router.get(
  '/stats',
  authorize('Admin', 'Staff'),
  getPolicyStats
);

// POST /api/policies/calculate-premium - Premium preview
router.post(
  '/calculate-premium',
  authorize('Customer', 'Staff'),
  calculatePremiumValidator,
  validate,
  calculatePremiumPreview
);

// GET /api/policies - Get all policies (All Authenticated)
router.get(
  '/',
  authorize('Admin', 'Staff', 'Customer'),
  policyQueryValidator,
  validate,
  getAllPolicies
);

// POST /api/policies - Create new policy (Admin only)
router.post(
  '/',
  authorize('Admin'),
  createPolicyValidator,
  validate,
  createPolicy
);

// ─────────────────────────────────────────────
// Routes with :id parameter
// ─────────────────────────────────────────────

// GET /api/policies/:id - Get policy by ID
router.get(
  '/:id',
  authorize('Admin', 'Staff', 'Customer'),
  policyIdValidator,
  validate,
  getPolicyById
);

// PUT /api/policies/:id - Update policy (Admin)
router.put(
  '/:id',
  authorize('Admin'),
  policyIdValidator,
  updatePolicyValidator,
  validate,
  updatePolicy
);

// DELETE /api/policies/:id - Toggle activate/deactivate (Admin)
router.delete(
  '/:id',
  authorize('Admin'),
  policyIdValidator,
  validate,
  togglePolicyStatus
);

// POST /api/policies/:id/purchase - Purchase policy (Customer)
router.post(
  '/:id/purchase',
  authorize('Customer'),
  policyIdValidator,
  purchasePolicyValidator,
  validate,
  purchasePolicy
);

export default router;