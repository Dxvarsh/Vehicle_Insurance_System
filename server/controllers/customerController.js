import Customer from '../models/Customer.js';
import User from '../models/User.js';
import Vehicle from '../models/Vehicle.js';
import Premium from '../models/Premium.js';
import Claim from '../models/Claim.js';
import PolicyRenewal from '../models/PolicyRenewal.js';
import Notification from '../models/Notification.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';

/**
 * @desc    Get all customers with search, filter, sort, pagination
 * @route   GET /api/customers
 * @access  Admin, Staff
 */
export const getAllCustomers = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = '',
            sortBy = 'createdAt',
            sortOrder = 'desc',
            isActive,
        } = req.query;

        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;

        // Build filter query
        const filter = {};

        // Search by name, email, contactNumber, or customerID
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { contactNumber: { $regex: search, $options: 'i' } },
                { customerID: { $regex: search, $options: 'i' } },
            ];
        }

        // Filter by active status
        if (isActive !== undefined) {
            filter.isActive = isActive === 'true';
        }

        // Build sort
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        // Execute query
        const [customers, total] = await Promise.all([
            Customer.find(filter)
                .populate('vehicleIDs', 'vehicleNumber vehicleType model')
                .sort(sort)
                .skip(skip)
                .limit(limitNum)
                .lean(),
            Customer.countDocuments(filter),
        ]);

        return paginatedResponse(res, customers, pageNum, limitNum, total);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get customer by ID
 * @route   GET /api/customers/:id
 * @access  Admin, Staff, Owner
 */
export const getCustomerById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const customer = await Customer.findById(id)
            .populate('vehicleIDs', 'vehicleID vehicleNumber vehicleType model registrationYear')
            .lean();

        if (!customer) {
            return errorResponse(res, 404, 'Customer not found');
        }

        // If role is Customer, check ownership
        if (req.user.role === 'Customer') {
            if (
                !req.user.linkedCustomerID ||
                req.user.linkedCustomerID.toString() !== id
            ) {
                return errorResponse(res, 403, 'Access denied. You can only view your own profile.');
            }
        }

        // Get associated user account info (without sensitive data)
        const userAccount = await User.findOne({ linkedCustomerID: id })
            .select('userID username role isActive lastLogin createdAt')
            .lean();

        return successResponse(res, 200, 'Customer fetched successfully', {
            customer,
            userAccount,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update customer profile
 * @route   PUT /api/customers/:id
 * @access  Admin, Owner
 */
export const updateCustomer = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, contactNumber, email, address } = req.body;

        // Find existing customer
        const customer = await Customer.findById(id);

        if (!customer) {
            return errorResponse(res, 404, 'Customer not found');
        }

        // If role is Customer, check ownership
        if (req.user.role === 'Customer') {
            if (
                !req.user.linkedCustomerID ||
                req.user.linkedCustomerID.toString() !== id
            ) {
                return errorResponse(res, 403, 'Access denied. You can only update your own profile.');
            }
        }

        // Check for duplicate email (if email is being changed)
        if (email && email !== customer.email) {
            const emailExists = await Customer.findOne({ email, _id: { $ne: id } });
            if (emailExists) {
                return errorResponse(res, 409, 'A customer with this email already exists');
            }

            // Also update email in User model
            const userAccount = await User.findOne({ linkedCustomerID: id });
            if (userAccount) {
                const userEmailExists = await User.findOne({ email, _id: { $ne: userAccount._id } });
                if (userEmailExists) {
                    return errorResponse(res, 409, 'A user with this email already exists');
                }
                userAccount.email = email;
                await userAccount.save({ validateBeforeSave: false });
            }
        }

        // Check for duplicate contact number
        if (contactNumber && contactNumber !== customer.contactNumber) {
            const contactExists = await Customer.findOne({ contactNumber, _id: { $ne: id } });
            if (contactExists) {
                return errorResponse(res, 409, 'A customer with this contact number already exists');
            }
        }

        // Update fields
        if (name) customer.name = name;
        if (contactNumber) customer.contactNumber = contactNumber;
        if (email) customer.email = email;
        if (address) customer.address = address;

        await customer.save();

        // Return updated customer with populated data
        const updatedCustomer = await Customer.findById(id)
            .populate('vehicleIDs', 'vehicleID vehicleNumber vehicleType model')
            .lean();

        return successResponse(res, 200, 'Customer updated successfully', {
            customer: updatedCustomer,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Deactivate / Activate customer account
 * @route   DELETE /api/customers/:id
 * @access  Admin
 */
export const toggleCustomerStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body; // Optional: explicit true/false

        const customer = await Customer.findById(id);

        if (!customer) {
            return errorResponse(res, 404, 'Customer not found');
        }

        // Toggle or set explicit status
        const newStatus = isActive !== undefined ? isActive : !customer.isActive;
        customer.isActive = newStatus;
        await customer.save();

        // Also update linked User account status
        const userAccount = await User.findOne({ linkedCustomerID: id });
        if (userAccount) {
            userAccount.isActive = newStatus;
            await userAccount.save({ validateBeforeSave: false });
        }

        const statusText = newStatus ? 'activated' : 'deactivated';

        return successResponse(res, 200, `Customer account ${statusText} successfully`, {
            customer: {
                _id: customer._id,
                customerID: customer.customerID,
                name: customer.name,
                email: customer.email,
                isActive: customer.isActive,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Staff registers a new customer with user account
 * @route   POST /api/customers/register
 * @access  Staff, Admin
 */
export const staffRegisterCustomer = async (req, res, next) => {
    try {
        const { name, contactNumber, email, address, username, password } = req.body;

        // Check if customer already exists
        const existingCustomer = await Customer.findOne({
            $or: [{ email }, { contactNumber }],
        });

        if (existingCustomer) {
            const field = existingCustomer.email === email ? 'email' : 'contact number';
            return errorResponse(res, 409, `Customer with this ${field} already exists`);
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }],
        });

        if (existingUser) {
            const field = existingUser.email === email ? 'email' : 'username';
            return errorResponse(res, 409, `User with this ${field} already exists`);
        }

        // Create customer
        const customer = await Customer.create({
            name,
            contactNumber,
            email,
            address,
        });

        // Create user account linked to customer
        const user = await User.create({
            username,
            email,
            password,
            role: 'Customer',
            linkedCustomerID: customer._id,
            emailVerified: true, // Staff-registered accounts are pre-verified
        });

        return successResponse(res, 201, 'Customer registered successfully by staff', {
            customer: {
                _id: customer._id,
                customerID: customer.customerID,
                name: customer.name,
                email: customer.email,
                contactNumber: customer.contactNumber,
                address: customer.address,
            },
            user: {
                _id: user._id,
                userID: user.userID,
                username: user.username,
                role: user.role,
            },
            registeredBy: {
                userID: req.user.userID,
                username: req.user.username,
                role: req.user.role,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get customer dashboard summary
 * @route   GET /api/customers/:id/dashboard
 * @access  Customer (Owner), Admin, Staff
 */
export const getCustomerDashboard = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Ownership check for Customer role
        if (req.user.role === 'Customer') {
            if (
                !req.user.linkedCustomerID ||
                req.user.linkedCustomerID.toString() !== id
            ) {
                return errorResponse(res, 403, 'Access denied.');
            }
        }

        // Verify customer exists
        const customer = await Customer.findById(id).lean();
        if (!customer) {
            return errorResponse(res, 404, 'Customer not found');
        }

        // Fetch all data in parallel
        const [
            vehicles,
            totalPremiums,
            paidPremiums,
            pendingPremiums,
            activePolicies,
            totalClaims,
            pendingClaims,
            approvedClaims,
            rejectedClaims,
            pendingRenewals,
            expiredRenewals,
            recentNotifications,
            unreadNotificationCount,
        ] = await Promise.all([
            // Vehicles
            Vehicle.find({ customerID: id })
                .select('vehicleID vehicleNumber vehicleType model registrationYear')
                .lean(),

            // Total premiums
            Premium.countDocuments({ customerID: id }),

            // Paid premiums
            Premium.countDocuments({ customerID: id, paymentStatus: 'Paid' }),

            // Pending premiums
            Premium.countDocuments({ customerID: id, paymentStatus: 'Pending' }),

            // Active policies (paid premiums = active)
            Premium.find({ customerID: id, paymentStatus: 'Paid' })
                .populate('policyID', 'policyID policyName coverageType policyDuration')
                .populate('vehicleID', 'vehicleNumber vehicleType model')
                .select('premiumID calculatedAmount paymentDate createdAt')
                .sort({ createdAt: -1 })
                .limit(5)
                .lean(),

            // Total claims
            Claim.countDocuments({ customerID: id }),

            // Pending claims
            Claim.countDocuments({ customerID: id, claimStatus: 'Pending' }),

            // Approved claims
            Claim.countDocuments({ customerID: id, claimStatus: 'Approved' }),

            // Rejected claims
            Claim.countDocuments({ customerID: id, claimStatus: 'Rejected' }),

            // Pending renewals
            PolicyRenewal.countDocuments({ customerID: id, renewalStatus: 'Pending' }),

            // Expired renewals
            PolicyRenewal.countDocuments({ customerID: id, renewalStatus: 'Expired' }),

            // Recent notifications (last 5)
            Notification.find({ customerID: id })
                .sort({ sentDate: -1 })
                .limit(5)
                .select('notificationID title messageType sentDate isRead')
                .lean(),

            // Unread notification count
            Notification.countDocuments({ customerID: id, isRead: false }),
        ]);

        // Calculate total paid amount
        const totalPaidAmount = await Premium.aggregate([
            {
                $match: {
                    customerID: customer._id,
                    paymentStatus: 'Paid',
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$calculatedAmount' },
                },
            },
        ]);

        // Calculate total claim amount approved
        const totalClaimAmount = await Claim.aggregate([
            {
                $match: {
                    customerID: customer._id,
                    claimStatus: 'Approved',
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$claimAmount' },
                },
            },
        ]);

        const dashboard = {
            customer: {
                _id: customer._id,
                customerID: customer.customerID,
                name: customer.name,
                email: customer.email,
            },

            summary: {
                vehicles: {
                    total: vehicles.length,
                    list: vehicles,
                },
                policies: {
                    active: paidPremiums,
                    total: totalPremiums,
                    pending: pendingPremiums,
                    recentActive: activePolicies,
                },
                claims: {
                    total: totalClaims,
                    pending: pendingClaims,
                    approved: approvedClaims,
                    rejected: rejectedClaims,
                    totalApprovedAmount: totalClaimAmount[0]?.total || 0,
                },
                renewals: {
                    pending: pendingRenewals,
                    expired: expiredRenewals,
                },
                payments: {
                    totalPaid: totalPaidAmount[0]?.total || 0,
                    pendingPayments: pendingPremiums,
                },
                notifications: {
                    recent: recentNotifications,
                    unreadCount: unreadNotificationCount,
                },
            },
        };

        return successResponse(res, 200, 'Customer dashboard fetched successfully', dashboard);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get customer statistics (for Admin dashboard)
 * @route   GET /api/customers/stats
 * @access  Admin, Staff
 */
export const getCustomerStats = async (req, res, next) => {
    try {
        const [
            totalCustomers,
            activeCustomers,
            inactiveCustomers,
            thisMonthCustomers,
            lastMonthCustomers,
        ] = await Promise.all([
            Customer.countDocuments(),
            Customer.countDocuments({ isActive: true }),
            Customer.countDocuments({ isActive: false }),
            Customer.countDocuments({
                createdAt: {
                    $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                },
            }),
            Customer.countDocuments({
                createdAt: {
                    $gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
                    $lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                },
            }),
        ]);

        // Growth percentage
        const growth = lastMonthCustomers > 0
            ? Math.round(((thisMonthCustomers - lastMonthCustomers) / lastMonthCustomers) * 100)
            : thisMonthCustomers > 0
                ? 100
                : 0;

        return successResponse(res, 200, 'Customer stats fetched successfully', {
            total: totalCustomers,
            active: activeCustomers,
            inactive: inactiveCustomers,
            thisMonth: thisMonthCustomers,
            lastMonth: lastMonthCustomers,
            growthPercentage: growth,
        });
    } catch (error) {
        next(error);
    }
};