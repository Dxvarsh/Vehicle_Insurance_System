import { errorResponse } from '../utils/apiResponse.js';
import config from '../config/env.js';

/**
 * Global Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let errors = null;

    // Log error in development
    if (config.nodeEnv === 'development') {
        console.error('❌ Error:', {
            message: err.message,
            stack: err.stack,
            statusCode,
        });
    }

    // Mongoose Validation Error
    if (err.name === 'ValidationError') {
        statusCode = 400;
        const validationErrors = Object.values(err.errors).map((e) => ({
            field: e.path,
            message: e.message,
        }));
        message = 'Validation failed';
        errors = validationErrors;
    }

    // Mongoose Duplicate Key Error
    if (err.code === 11000) {
        statusCode = 409;
        const field = Object.keys(err.keyPattern)[0];
        message = `Duplicate value for '${field}'. This ${field} already exists.`;
    }

    // Mongoose Cast Error (Invalid ObjectId)
    if (err.name === 'CastError') {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
    }

    // JWT Errors
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired';
    }

    // Send error response
    return errorResponse(res, statusCode, message, errors);
};

export default errorHandler;