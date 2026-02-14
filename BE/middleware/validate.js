import { validationResult } from 'express-validator';
import { errorResponse } from '../utils/apiResponse.js';

/**
 * Middleware to handle express-validator results
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map((err) => ({
            field: err.path,
            message: err.msg,
            value: err.value,
        }));

        return errorResponse(res, 400, 'Validation failed', formattedErrors);
    }

    next();
};

export default validate;