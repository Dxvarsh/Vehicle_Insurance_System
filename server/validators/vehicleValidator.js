import { body, param, query } from 'express-validator';

export const addVehicleValidator = [
    body('vehicleNumber')
        .trim()
        .notEmpty()
        .withMessage('Vehicle number is required')
        .toUpperCase()
        .matches(/^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/)
        .withMessage('Vehicle number must be in valid format (e.g., KA01AB1234 or MH02A5678)'),

    body('vehicleType')
        .trim()
        .notEmpty()
        .withMessage('Vehicle type is required')
        .isIn(['2-Wheeler', '4-Wheeler', 'Commercial'])
        .withMessage('Vehicle type must be 2-Wheeler, 4-Wheeler, or Commercial'),

    body('model')
        .trim()
        .notEmpty()
        .withMessage('Vehicle model is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Model must be between 2 and 100 characters'),

    body('registrationYear')
        .notEmpty()
        .withMessage('Registration year is required')
        .isInt({ min: 1990, max: new Date().getFullYear() })
        .withMessage(`Registration year must be between 1990 and ${new Date().getFullYear()}`),

    body('customerID')
        .optional()
        .isMongoId()
        .withMessage('Invalid Customer ID format'),
];

export const updateVehicleValidator = [
    body('vehicleNumber')
        .optional()
        .trim()
        .toUpperCase()
        .matches(/^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/)
        .withMessage('Vehicle number must be in valid format (e.g., KA01AB1234)'),

    body('vehicleType')
        .optional()
        .trim()
        .isIn(['2-Wheeler', '4-Wheeler', 'Commercial'])
        .withMessage('Vehicle type must be 2-Wheeler, 4-Wheeler, or Commercial'),

    body('model')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Model must be between 2 and 100 characters'),

    body('registrationYear')
        .optional()
        .isInt({ min: 1990, max: new Date().getFullYear() })
        .withMessage(`Registration year must be between 1990 and ${new Date().getFullYear()}`),
];

export const vehicleIdValidator = [
    param('id')
        .notEmpty()
        .withMessage('Vehicle ID is required')
        .isMongoId()
        .withMessage('Invalid Vehicle ID format'),
];

export const vehicleQueryValidator = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),

    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),

    query('search')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Search query too long'),

    query('vehicleType')
        .optional()
        .isIn(['2-Wheeler', '4-Wheeler', 'Commercial', ''])
        .withMessage('Invalid vehicle type filter'),

    query('sortBy')
        .optional()
        .isIn(['vehicleNumber', 'vehicleType', 'model', 'registrationYear', 'createdAt', 'vehicleID'])
        .withMessage('Invalid sort field'),

    query('sortOrder')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Sort order must be asc or desc'),

    query('customerID')
        .optional()
        .isMongoId()
        .withMessage('Invalid Customer ID filter'),
];