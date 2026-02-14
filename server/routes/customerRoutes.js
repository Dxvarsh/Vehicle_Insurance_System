import express from 'express';
import {
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    toggleCustomerStatus,
    staffRegisterCustomer,
    getCustomerDashboard,
    getCustomerStats,
} from '../controllers/customerController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import validate from '../middleware/validate.js';
import {
    updateCustomerValidator,
    customerIdValidator,
    customerQueryValidator,
    staffRegisterCustomerValidator,
    toggleStatusValidator,
} from '../validators/customerValidator.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// ─────────────────────────────────────────────
// Admin & Staff Routes
// ─────────────────────────────────────────────

// GET /api/customers/stats - Customer statistics (Admin, Staff)
router.get(
    '/stats',
    authorize('Admin', 'Staff'),
    getCustomerStats
);

// GET /api/customers - Get all customers with search & filter (Admin, Staff)
router.get(
    '/',
    authorize('Admin', 'Staff'),
    customerQueryValidator,
    validate,
    getAllCustomers
);

// POST /api/customers/register - Staff registers new customer (Admin, Staff)
router.post(
    '/register',
    authorize('Admin', 'Staff'),
    staffRegisterCustomerValidator,
    validate,
    staffRegisterCustomer
);

// ─────────────────────────────────────────────
// Customer-Specific Routes (with ID)
// ─────────────────────────────────────────────

// GET /api/customers/:id/dashboard - Customer dashboard summary
router.get(
    '/:id/dashboard',
    authorize('Admin', 'Staff', 'Customer'),
    customerIdValidator,
    validate,
    getCustomerDashboard
);

// GET /api/customers/:id - Get customer by ID (Admin, Staff, Owner)
router.get(
    '/:id',
    authorize('Admin', 'Staff', 'Customer'),
    customerIdValidator,
    validate,
    getCustomerById
);

// PUT /api/customers/:id - Update customer profile (Admin, Owner)
router.put(
    '/:id',
    authorize('Admin', 'Customer'),
    customerIdValidator,
    updateCustomerValidator,
    validate,
    updateCustomer
);

// DELETE /api/customers/:id - Deactivate/Activate customer (Admin only)
router.delete(
    '/:id',
    authorize('Admin'),
    toggleStatusValidator,
    validate,
    toggleCustomerStatus
);

export default router;