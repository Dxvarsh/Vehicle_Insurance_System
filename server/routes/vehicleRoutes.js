import express from 'express';
import {
    addVehicle,
    getAllVehicles,
    getMyVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle,
    getVehicleStats,
} from '../controllers/vehicleController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import validate from '../middleware/validate.js';
import {
    addVehicleValidator,
    updateVehicleValidator,
    vehicleIdValidator,
    vehicleQueryValidator,
} from '../validators/vehicleValidator.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// ─────────────────────────────────────────────
// Order matters! Static routes BEFORE :id routes
// ─────────────────────────────────────────────

// GET /api/vehicles/stats - Vehicle statistics (Admin, Staff)
router.get(
    '/stats',
    authorize('Admin', 'Staff'),
    getVehicleStats
);

// GET /api/vehicles/my - Get logged-in customer's vehicles
router.get(
    '/my',
    authorize('Customer'),
    vehicleQueryValidator,
    validate,
    getMyVehicles
);

// GET /api/vehicles - Get all vehicles (Admin, Staff)
router.get(
    '/',
    authorize('Admin', 'Staff'),
    vehicleQueryValidator,
    validate,
    getAllVehicles
);

// POST /api/vehicles - Add new vehicle (Customer, Staff, Admin)
router.post(
    '/',
    authorize('Customer', 'Staff', 'Admin'),
    addVehicleValidator,
    validate,
    addVehicle
);

// GET /api/vehicles/:id - Get vehicle by ID (Admin, Staff, Owner)
router.get(
    '/:id',
    authorize('Admin', 'Staff', 'Customer'),
    vehicleIdValidator,
    validate,
    getVehicleById
);

// PUT /api/vehicles/:id - Update vehicle (Customer Owner, Staff, Admin)
router.put(
    '/:id',
    authorize('Customer', 'Staff', 'Admin'),
    vehicleIdValidator,
    updateVehicleValidator,
    validate,
    updateVehicle
);

// DELETE /api/vehicles/:id - Delete vehicle (Customer Owner, Admin)
router.delete(
    '/:id',
    authorize('Customer', 'Admin'),
    vehicleIdValidator,
    validate,
    deleteVehicle
);

export default router;