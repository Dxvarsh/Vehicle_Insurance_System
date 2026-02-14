import User from '../models/User.js';
import Customer from '../models/Customer.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/generateToken.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import crypto from 'crypto';
import config from '../config/env.js';

/**
 * @desc    Register new customer user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
    try {
        const { username, email, password, name, contactNumber, address } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }],
        });

        if (existingUser) {
            const field = existingUser.email === email ? 'email' : 'username';
            return errorResponse(res, 409, `User with this ${field} already exists`);
        }

        // Check if customer with same email or contact exists
        const existingCustomer = await Customer.findOne({
            $or: [{ email }, { contactNumber }],
        });

        if (existingCustomer) {
            return errorResponse(res, 409, 'Customer with this email or contact number already exists');
        }

        // Create customer first
        const customer = await Customer.create({
            name,
            contactNumber,
            email,
            address,
        });

        // Create user linked to customer
        const user = await User.create({
            username,
            email,
            password,
            role: 'Customer',
            linkedCustomerID: customer._id,
        });

        // Generate tokens
        const accessToken = generateAccessToken(user._id, user.role);
        const refreshToken = generateRefreshToken(user._id);

        // Save refresh token to user
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        // Set cookies
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: config.nodeEnv === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: config.nodeEnv === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return successResponse(res, 201, 'Registration successful', {
            user: {
                _id: user._id,
                userID: user.userID,
                username: user.username,
                email: user.email,
                role: user.role,
                linkedCustomerID: user.linkedCustomerID,
            },
            customer: {
                _id: customer._id,
                customerID: customer.customerID,
                name: customer.name,
                email: customer.email,
                contactNumber: customer.contactNumber,
            },
            accessToken,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find user with password field
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return errorResponse(res, 401, 'Invalid email or password');
        }

        // Check if account is active
        if (!user.isActive) {
            return errorResponse(res, 403, 'Your account has been deactivated. Contact admin.');
        }

        // Compare password
        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            return errorResponse(res, 401, 'Invalid email or password');
        }

        // Generate tokens
        const accessToken = generateAccessToken(user._id, user.role);
        const refreshToken = generateRefreshToken(user._id);

        // Save refresh token and last login
        user.refreshToken = refreshToken;
        user.lastLogin = new Date();
        await user.save({ validateBeforeSave: false });

        // Set cookies
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: config.nodeEnv === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: config.nodeEnv === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // Get customer info if role is Customer
        let customerInfo = null;
        if (user.role === 'Customer' && user.linkedCustomerID) {
            customerInfo = await Customer.findById(user.linkedCustomerID);
        }

        return successResponse(res, 200, 'Login successful', {
            user: {
                _id: user._id,
                userID: user.userID,
                username: user.username,
                email: user.email,
                role: user.role,
                linkedCustomerID: user.linkedCustomerID,
                lastLogin: user.lastLogin,
            },
            customer: customerInfo,
            accessToken,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Authenticated
 */
export const logout = async (req, res, next) => {
    try {
        // Clear refresh token from database
        await User.findByIdAndUpdate(req.user._id, {
            refreshToken: null,
        });

        // Clear cookies
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        return successResponse(res, 200, 'Logout successful');
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Refresh access token
 * @route   POST /api/auth/refresh-token
 * @access  Public (requires valid refresh token)
 */
export const refreshAccessToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

        if (!refreshToken) {
            return errorResponse(res, 401, 'Refresh token not provided');
        }

        // Verify refresh token
        const decoded = verifyRefreshToken(refreshToken);

        // Find user with matching refresh token
        const user = await User.findById(decoded.id).select('+refreshToken');

        if (!user || user.refreshToken !== refreshToken) {
            return errorResponse(res, 401, 'Invalid refresh token');
        }

        if (!user.isActive) {
            return errorResponse(res, 403, 'Account deactivated');
        }

        // Generate new access token
        const newAccessToken = generateAccessToken(user._id, user.role);

        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: config.nodeEnv === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000,
        });

        return successResponse(res, 200, 'Token refreshed', {
            accessToken: newAccessToken,
        });
    } catch (error) {
        return errorResponse(res, 401, 'Invalid or expired refresh token');
    }
};

/**
 * @desc    Forgot password - Generate reset token
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            // Don't reveal if email exists
            return successResponse(res, 200, 'If an account exists with this email, a reset link will be sent.');
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Save hashed token with expiry
        user.passwordResetToken = hashedToken;
        user.passwordResetExpires = Date.now() + config.passwordResetExpiry;
        await user.save({ validateBeforeSave: false });

        // TODO: Send email with reset link
        // const resetUrl = `${config.clientUrl}/reset-password/${resetToken}`;
        // await sendEmail({...})

        return successResponse(res, 200, 'If an account exists with this email, a reset link will be sent.', {
            // Only in development - remove in production
            ...(config.nodeEnv === 'development' && { resetToken }),
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Reset password
 * @route   PUT /api/auth/reset-password/:token
 * @access  Public
 */
export const resetPassword = async (req, res, next) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        // Hash the provided token
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // Find user with valid reset token
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() },
        }).select('+passwordResetToken +passwordResetExpires');

        if (!user) {
            return errorResponse(res, 400, 'Invalid or expired reset token');
        }

        // Update password
        user.password = password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        user.refreshToken = undefined; // Invalidate all sessions
        await user.save();

        return successResponse(res, 200, 'Password reset successful. Please login with your new password.');
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get current logged-in user
 * @route   GET /api/auth/me
 * @access  Authenticated
 */
export const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        let customerInfo = null;
        if (user.role === 'Customer' && user.linkedCustomerID) {
            customerInfo = await Customer.findById(user.linkedCustomerID).populate('vehicleIDs');
        }

        return successResponse(res, 200, 'User profile fetched', {
            user,
            customer: customerInfo,
        });
    } catch (error) {
        next(error);
    }
};