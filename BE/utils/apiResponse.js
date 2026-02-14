/**
 * Standardized API Response Utility
 */

export const successResponse = (res, statusCode = 200, message = 'Success', data = null) => {
    const response = {
        success: true,
        message,
    };

    if (data !== null) {
        response.data = data;
    }

    return res.status(statusCode).json(response);
};

export const errorResponse = (res, statusCode = 500, message = 'Internal Server Error', errors = null) => {
    const response = {
        success: false,
        message,
    };

    if (errors !== null) {
        response.errors = errors;
    }

    return res.status(statusCode).json(response);
};

export const paginatedResponse = (res, data, page, limit, total) => {
    return res.status(200).json({
        success: true,
        message: 'Data fetched successfully',
        data,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalRecords: total,
            limit,
            hasNextPage: page * limit < total,
            hasPrevPage: page > 1,
        },
    });
};