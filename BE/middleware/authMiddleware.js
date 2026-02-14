import { verifyAccessToken } from '../utils/generateToken.js';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import { errorResponse } from '../utils/apiResponse.js';

/**
 * Protect routes - Verify JWT token
 */
export const protect = async (req, res, next) => {
    try {
        let token;

        // Check for token in Authorization header
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }
        // Also check cookies
        else if (req.cookies?.accessToken) {
            token = req.cookies.accessToken;
        }

        if (!token) {
            return errorResponse(res, 401, 'Access denied. No token provided.');
        }

        // Verify token
        const decoded = verifyAccessToken(token);

        // Get user from database
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return errorResponse(res, 401, 'User not found. Token is invalid.');
        }

        if (!user.isActive) {
            return errorResponse(res, 403, 'Your account has been deactivated. Contact admin.');
        }

        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return errorResponse(res, 401, 'Invalid token.');
        }
        if (error.name === 'TokenExpiredError') {
            return errorResponse(res, 401, 'Token has expired. Please login again.');
        }
        return errorResponse(res, 500, 'Authentication error.');
    }
};

/**
 * Role-based access control middleware
 * @param  {...string} roles - Allowed roles
 */
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return errorResponse(res, 401, 'Authentication required.');
        }

        if (!roles.includes(req.user.role)) {
            return errorResponse(
                res,
                403,
                `Access denied. Role '${req.user.role}' is not authorized to access this resource.`
            );
        }

        next();
    };
};

/**
 * Check if user is the owner of the resource or is Admin
 */
export const isOwnerOrAdmin = (customerIdField = 'customerID') => {
    return (req, res, next) => {
        if (req.user.role === 'Admin') {
            return next();
        }

        if (req.user.role === 'Staff') {
            return next();
        }

        // For customers, check if they own the resource
        const resourceCustomerId = req.params[customerIdField] || req.body[customerIdField];

        if (
            req.user.linkedCustomerID &&
            req.user.linkedCustomerID.toString() === resourceCustomerId
        ) {
            return next();
        }

        return errorResponse(res, 403, 'Access denied. You can only access your own resources.');
    };
};