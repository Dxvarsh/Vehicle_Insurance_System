import Vehicle from '../models/Vehicle.js';
import Customer from '../models/Customer.js';
import Premium from '../models/Premium.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';

/**
 * @desc    Add a new vehicle
 * @route   POST /api/vehicles
 * @access  Customer, Staff, Admin
 *
 * Requirements: VEH-01 (Customer adds vehicle), VEH-06 (Staff adds for customer)
 */
export const addVehicle = async (req, res, next) => {
    try {
        const { vehicleNumber, vehicleType, model, registrationYear, customerID } = req.body;

        // ── Determine which customer this vehicle belongs to ──
        let targetCustomerID;

        if (req.user.role === 'Customer') {
            // Customer can only add vehicles to their own account
            if (!req.user.linkedCustomerID) {
                return errorResponse(res, 400, 'No customer profile linked to your account');
            }
            targetCustomerID = req.user.linkedCustomerID;
        } else if (req.user.role === 'Staff' || req.user.role === 'Admin') {
            // Staff/Admin must provide customerID
            if (!customerID) {
                return errorResponse(res, 400, 'Customer ID is required when adding vehicle for a customer');
            }
            targetCustomerID = customerID;
        }

        // ── Verify customer exists and is active ──
        const customer = await Customer.findById(targetCustomerID);

        if (!customer) {
            return errorResponse(res, 404, 'Customer not found');
        }

        if (!customer.isActive) {
            return errorResponse(res, 400, 'Cannot add vehicle to an inactive customer account');
        }

        // ── Check duplicate vehicle number (VEH-08) ──
        const existingVehicle = await Vehicle.findOne({
            vehicleNumber: vehicleNumber.toUpperCase(),
        });

        if (existingVehicle) {
            return errorResponse(
                res,
                409,
                `Vehicle with number ${vehicleNumber.toUpperCase()} is already registered`
            );
        }

        // ── Create vehicle ──
        const vehicle = await Vehicle.create({
            vehicleNumber: vehicleNumber.toUpperCase(),
            vehicleType,
            model,
            registrationYear,
            customerID: targetCustomerID,
        });

        // ── Add vehicle reference to customer ──
        customer.vehicleIDs.push(vehicle._id);
        await customer.save();

        // ── Populate and return ──
        const populatedVehicle = await Vehicle.findById(vehicle._id)
            .populate('customerID', 'customerID name email contactNumber')
            .lean();

        return successResponse(res, 201, 'Vehicle added successfully', {
            vehicle: populatedVehicle,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all vehicles with search, filter, sort, pagination
 * @route   GET /api/vehicles
 * @access  Admin, Staff
 *
 * Requirement: VEH-05 (Admin views all vehicles with filters)
 */
export const getAllVehicles = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = '',
            vehicleType,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            customerID,
        } = req.query;

        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;

        // ── Build filter ──
        const filter = {};

        // Search by vehicleNumber, model, or vehicleID
        if (search) {
            filter.$or = [
                { vehicleNumber: { $regex: search, $options: 'i' } },
                { model: { $regex: search, $options: 'i' } },
                { vehicleID: { $regex: search, $options: 'i' } },
            ];
        }

        // Filter by vehicle type
        if (vehicleType) {
            filter.vehicleType = vehicleType;
        }

        // Filter by customer
        if (customerID) {
            filter.customerID = customerID;
        }

        // ── Build sort ──
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        // ── Execute query ──
        const [vehicles, total] = await Promise.all([
            Vehicle.find(filter)
                .populate('customerID', 'customerID name email contactNumber')
                .sort(sort)
                .skip(skip)
                .limit(limitNum)
                .lean(),
            Vehicle.countDocuments(filter),
        ]);

        return paginatedResponse(res, vehicles, pageNum, limitNum, total);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get logged-in customer's vehicles
 * @route   GET /api/vehicles/my
 * @access  Customer
 *
 * Requirement: VEH-02 (Customer views their vehicle list)
 */
export const getMyVehicles = async (req, res, next) => {
    try {
        if (!req.user.linkedCustomerID) {
            return errorResponse(res, 400, 'No customer profile linked to your account');
        }

        const {
            page = 1,
            limit = 10,
            search = '',
            vehicleType,
            sortBy = 'createdAt',
            sortOrder = 'desc',
        } = req.query;

        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;

        // ── Build filter (only this customer's vehicles) ──
        const filter = { customerID: req.user.linkedCustomerID };

        if (search) {
            filter.$or = [
                { vehicleNumber: { $regex: search, $options: 'i' } },
                { model: { $regex: search, $options: 'i' } },
                { vehicleID: { $regex: search, $options: 'i' } },
            ];
        }

        if (vehicleType) {
            filter.vehicleType = vehicleType;
        }

        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const [vehicles, total] = await Promise.all([
            Vehicle.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limitNum)
                .lean(),
            Vehicle.countDocuments(filter),
        ]);

        return paginatedResponse(res, vehicles, pageNum, limitNum, total);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get vehicle by ID
 * @route   GET /api/vehicles/:id
 * @access  Admin, Staff, Owner
 *
 * Requirement: VEH-02 (part of viewing vehicle details)
 */
export const getVehicleById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const vehicle = await Vehicle.findById(id)
            .populate('customerID', 'customerID name email contactNumber')
            .lean();

        if (!vehicle) {
            return errorResponse(res, 404, 'Vehicle not found');
        }

        // ── Ownership check for Customer role ──
        if (req.user.role === 'Customer') {
            if (
                !req.user.linkedCustomerID ||
                req.user.linkedCustomerID.toString() !== vehicle.customerID._id.toString()
            ) {
                return errorResponse(res, 403, 'Access denied. You can only view your own vehicles.');
            }
        }

        // ── Check if vehicle has any active policies ──
        const activePremiums = await Premium.find({
            vehicleID: id,
            paymentStatus: 'Paid',
        })
            .populate('policyID', 'policyID policyName coverageType policyDuration')
            .select('premiumID calculatedAmount paymentStatus paymentDate')
            .lean();

        return successResponse(res, 200, 'Vehicle fetched successfully', {
            vehicle,
            activePolicies: activePremiums,
            hasActivePolicies: activePremiums.length > 0,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update vehicle details
 * @route   PUT /api/vehicles/:id
 * @access  Customer (Owner), Staff, Admin
 *
 * Requirement: VEH-03 (Customer edits vehicle)
 */
export const updateVehicle = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { vehicleNumber, vehicleType, model, registrationYear } = req.body;

        // ── Find vehicle ──
        const vehicle = await Vehicle.findById(id);

        if (!vehicle) {
            return errorResponse(res, 404, 'Vehicle not found');
        }

        // ── Ownership check for Customer role ──
        if (req.user.role === 'Customer') {
            if (
                !req.user.linkedCustomerID ||
                req.user.linkedCustomerID.toString() !== vehicle.customerID.toString()
            ) {
                return errorResponse(res, 403, 'Access denied. You can only edit your own vehicles.');
            }
        }

        // ── Check duplicate vehicle number if being changed (VEH-08) ──
        if (vehicleNumber && vehicleNumber.toUpperCase() !== vehicle.vehicleNumber) {
            const duplicateVehicle = await Vehicle.findOne({
                vehicleNumber: vehicleNumber.toUpperCase(),
                _id: { $ne: id },
            });

            if (duplicateVehicle) {
                return errorResponse(
                    res,
                    409,
                    `Vehicle with number ${vehicleNumber.toUpperCase()} is already registered`
                );
            }
        }

        // ── Check if vehicle has active policies before changing type ──
        if (vehicleType && vehicleType !== vehicle.vehicleType) {
            const activePremiums = await Premium.countDocuments({
                vehicleID: id,
                paymentStatus: 'Paid',
            });

            if (activePremiums > 0) {
                return errorResponse(
                    res,
                    400,
                    'Cannot change vehicle type while there are active policies. Please contact admin.'
                );
            }
        }

        // ── Update fields ──
        if (vehicleNumber) vehicle.vehicleNumber = vehicleNumber.toUpperCase();
        if (vehicleType) vehicle.vehicleType = vehicleType;
        if (model) vehicle.model = model;
        if (registrationYear) vehicle.registrationYear = registrationYear;

        await vehicle.save();

        // ── Return updated vehicle ──
        const updatedVehicle = await Vehicle.findById(id)
            .populate('customerID', 'customerID name email contactNumber')
            .lean();

        return successResponse(res, 200, 'Vehicle updated successfully', {
            vehicle: updatedVehicle,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete vehicle
 * @route   DELETE /api/vehicles/:id
 * @access  Customer (Owner), Admin
 *
 * Requirement: VEH-04 (Delete vehicle only if no active policy)
 */
export const deleteVehicle = async (req, res, next) => {
    try {
        const { id } = req.params;

        // ── Find vehicle ──
        const vehicle = await Vehicle.findById(id);

        if (!vehicle) {
            return errorResponse(res, 404, 'Vehicle not found');
        }

        // ── Ownership check for Customer role ──
        if (req.user.role === 'Customer') {
            if (
                !req.user.linkedCustomerID ||
                req.user.linkedCustomerID.toString() !== vehicle.customerID.toString()
            ) {
                return errorResponse(res, 403, 'Access denied. You can only delete your own vehicles.');
            }
        }

        // ── Check for active policies (VEH-04) ──
        const activePremiums = await Premium.countDocuments({
            vehicleID: id,
            paymentStatus: 'Paid',
        });

        if (activePremiums > 0) {
            return errorResponse(
                res,
                400,
                'Cannot delete vehicle with active insurance policies. Please wait for policies to expire or contact admin.'
            );
        }

        // ── Check for pending premiums ──
        const pendingPremiums = await Premium.countDocuments({
            vehicleID: id,
            paymentStatus: 'Pending',
        });

        if (pendingPremiums > 0) {
            return errorResponse(
                res,
                400,
                'Cannot delete vehicle with pending premium payments. Please complete or cancel pending payments first.'
            );
        }

        // ── Check for pending claims ──
        const pendingClaims = await Premium.countDocuments({
            vehicleID: id,
            claimStatus: { $in: ['Pending', 'Under-Review'] },
        });

        if (pendingClaims > 0) {
            return errorResponse(
                res,
                400,
                'Cannot delete vehicle with pending or under-review claims.'
            );
        }

        // ── Remove vehicle reference from customer ──
        await Customer.findByIdAndUpdate(vehicle.customerID, {
            $pull: { vehicleIDs: vehicle._id },
        });

        // ── Delete vehicle ──
        await Vehicle.findByIdAndDelete(id);

        return successResponse(res, 200, 'Vehicle deleted successfully', {
            deletedVehicle: {
                _id: vehicle._id,
                vehicleID: vehicle.vehicleID,
                vehicleNumber: vehicle.vehicleNumber,
                model: vehicle.model,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get vehicle statistics
 * @route   GET /api/vehicles/stats
 * @access  Admin, Staff
 */
export const getVehicleStats = async (req, res, next) => {
    try {
        const [
            totalVehicles,
            twoWheelers,
            fourWheelers,
            commercialVehicles,
            thisMonthVehicles,
            lastMonthVehicles,
        ] = await Promise.all([
            Vehicle.countDocuments(),
            Vehicle.countDocuments({ vehicleType: '2-Wheeler' }),
            Vehicle.countDocuments({ vehicleType: '4-Wheeler' }),
            Vehicle.countDocuments({ vehicleType: 'Commercial' }),
            Vehicle.countDocuments({
                createdAt: {
                    $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                },
            }),
            Vehicle.countDocuments({
                createdAt: {
                    $gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
                    $lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                },
            }),
        ]);

        // Growth calculation
        const growth = lastMonthVehicles > 0
            ? Math.round(((thisMonthVehicles - lastMonthVehicles) / lastMonthVehicles) * 100)
            : thisMonthVehicles > 0
                ? 100
                : 0;

        // ── Vehicle age distribution ──
        const currentYear = new Date().getFullYear();
        const ageDistribution = await Vehicle.aggregate([
            {
                $addFields: {
                    vehicleAge: { $subtract: [currentYear, '$registrationYear'] },
                },
            },
            {
                $bucket: {
                    groupBy: '$vehicleAge',
                    boundaries: [0, 3, 6, 10, 100],
                    default: 'Other',
                    output: {
                        count: { $sum: 1 },
                    },
                },
            },
        ]);

        // Format age distribution
        const ageBucketLabels = {
            0: '0-2 years',
            3: '3-5 years',
            6: '6-9 years',
            10: '10+ years',
        };

        const formattedAgeDistribution = ageDistribution.map((bucket) => ({
            range: ageBucketLabels[bucket._id] || `${bucket._id}+ years`,
            count: bucket.count,
        }));

        return successResponse(res, 200, 'Vehicle stats fetched successfully', {
            total: totalVehicles,
            byType: {
                '2-Wheeler': twoWheelers,
                '4-Wheeler': fourWheelers,
                'Commercial': commercialVehicles,
            },
            thisMonth: thisMonthVehicles,
            lastMonth: lastMonthVehicles,
            growthPercentage: growth,
            ageDistribution: formattedAgeDistribution,
        });
    } catch (error) {
        next(error);
    }
};