import express from 'express';
import {
    register,
    login,
    logout,
    refreshAccessToken,
    forgotPassword,
    resetPassword,
    getMe,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import validate from '../middleware/validate.js';
import {
    registerValidator,
    loginValidator,
    forgotPasswordValidator,
    resetPasswordValidator,
} from '../validators/authValidator.js';

const router = express.Router();

// Public routes
router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);
router.post('/forgot-password', forgotPasswordValidator, validate, forgotPassword);
router.put('/reset-password/:token', resetPasswordValidator, validate, resetPassword);
router.post('/refresh-token', refreshAccessToken);

// Protected routes
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

export default router;