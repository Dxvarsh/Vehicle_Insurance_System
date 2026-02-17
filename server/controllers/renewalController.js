import PolicyRenewal from '../models/PolicyRenewal.js';
import Premium from '../models/Premium.js';
import InsurancePolicy from '../models/InsurancePolicy.js';
import Vehicle from '../models/Vehicle.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';
import { calculatePremium } from '../utils/premiumCalculator.js';

/**
 * @desc    Submit renewal request
 * @route   POST /api/renewals
 * @access  Customer
 */
export const submitRenewalRequest = async (req, res, next) => {
  try {
    const { policyID, vehicleID } = req.body;

    if (!req.user.linkedCustomerID) {
      return errorResponse(res, 400, 'No linked customer profile');
    }
    const customerID = req.user.linkedCustomerID;

    // Check if vehicle and policy exist
    const [policy, vehicle] = await Promise.all([
      InsurancePolicy.findById(policyID),
      Vehicle.findById(vehicleID)
    ]);

    if (!policy || !vehicle) {
      return errorResponse(res, 404, 'Policy or Vehicle not found');
    }

    // Check for existing pending renewal for this vehicle/policy
    const existingPending = await PolicyRenewal.findOne({
      vehicleID,
      policyID,
      renewalStatus: 'Pending',
    });

    if (existingPending) {
        return errorResponse(res, 409, 'A renewal request is already pending for this policy.');
    }

    // Calculate new premium
    const breakdown = calculatePremium(policy, vehicle);

    // Create new premium record for renewal (Payment Pending)
    const newPremium = await Premium.create({
      policyID,
      vehicleID,
      customerID,
      calculatedAmount: breakdown.finalAmount,
      calculationBreakdown: breakdown,
      paymentStatus: 'Pending'
    });

    // Determine dates (assuming renewal starts today if expired, or extends from current expiry?)
    // Simplified logic: Renewal starts from today effectively for the request, expiry is +duration
    const renewalDate = new Date();
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + policy.policyDuration);

    const renewal = await PolicyRenewal.create({
      policyID,
      premiumID: newPremium._id,
      vehicleID,
      customerID,
      renewalDate,
      expiryDate,
      renewalStatus: 'Pending'
    });

    // Ideally, we might want to link this to the Previous Renewal record if we had that chain.
    // For now, it's a new renewal entry.

    return successResponse(res, 201, 'Renewal request submitted', { renewal, premium: newPremium });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all renewals (Admin/Staff)
 * @route   GET /api/renewals
 * @access  Admin, Staff
 */
export const getAllRenewals = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, renewalStatus, search } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const filter = {};
    if (renewalStatus) filter.renewalStatus = renewalStatus;
    
    // Search logic requires aggregation or population filtering which is complex with Mongoose find()
    // For simple implementation, we just filter by status.

    const [renewals, total] = await Promise.all([
      PolicyRenewal.find(filter)
        .populate('customerID', 'name email customerID')
        .populate('policyID', 'policyName policyID')
        .populate('vehicleID', 'vehicleNumber model')
        .populate('premiumID', 'calculatedAmount paymentStatus')
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
      PolicyRenewal.countDocuments(filter)
    ]);

    return paginatedResponse(res, renewals, pageNum, limitNum, total);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get my renewals (Customer)
 * @route   GET /api/renewals/my
 * @access  Customer
 */
export const getMyRenewals = async (req, res, next) => {
  try {
    if (!req.user.linkedCustomerID) {
      return errorResponse(res, 400, 'No linked customer profile');
    }

    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const [renewals, total] = await Promise.all([
      PolicyRenewal.find({ customerID: req.user.linkedCustomerID })
        .populate('policyID', 'policyName policyID coverageType')
        .populate('vehicleID', 'vehicleNumber model')
        .populate('premiumID', 'calculatedAmount paymentStatus')
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
      PolicyRenewal.countDocuments({ customerID: req.user.linkedCustomerID })
    ]);

    return paginatedResponse(res, renewals, pageNum, limitNum, total);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get renewal by ID
 * @route   GET /api/renewals/:id
 * @access  Protected
 */
export const getRenewalById = async (req, res, next) => {
    try {
        const renewal = await PolicyRenewal.findById(req.params.id)
            .populate('customerID', 'name email contactNumber customerID')
            .populate('policyID', 'policyName policyID coverageType description')
            .populate('vehicleID', 'vehicleNumber model vehicleType registrationYear')
            .populate('premiumID', 'calculatedAmount paymentStatus calculationBreakdown');

        if (!renewal) {
            return errorResponse(res, 404, 'Renewal record not found');
        }

        // Access Control
        if (req.user.role === 'Customer') {
             if (renewal.customerID._id.toString() !== req.user.linkedCustomerID?.toString()) {
                 return errorResponse(res, 403, 'Unauthorized access to this renewal');
             }
        }

        return successResponse(res, 200, 'Renewal details fetched', { renewal });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Approve renewal (Admin)
 * @route   PUT /api/renewals/:id/approve
 * @access  Admin
 */
export const approveRenewal = async (req, res, next) => {
  try {
    const { adminRemarks } = req.body;
    const renewal = await PolicyRenewal.findById(req.params.id);
    if (!renewal) return errorResponse(res, 404, 'Renewal record not found');

    renewal.renewalStatus = 'Approved';
    renewal.adminRemarks = adminRemarks;
    await renewal.save();

    return successResponse(res, 200, 'Renewal approved', { renewal });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reject renewal (Admin)
 * @route   PUT /api/renewals/:id/reject
 * @access  Admin
 */
export const rejectRenewal = async (req, res, next) => {
  try {
    const { adminRemarks } = req.body;
    const renewal = await PolicyRenewal.findById(req.params.id);
    if (!renewal) return errorResponse(res, 404, 'Renewal record not found');

    renewal.renewalStatus = 'Rejected';
    renewal.adminRemarks = adminRemarks;
    await renewal.save();

    // Optionally mark associated premium as canceled
    const premium = await Premium.findById(renewal.premiumID);
    if (premium && premium.paymentStatus === 'Pending') {
        premium.paymentStatus = 'Failed'; // Or Canceled concept if we add it
        await premium.save();
    }

    return successResponse(res, 200, 'Renewal rejected', { renewal });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get expiring renewals (Admin)
 * @route   GET /api/renewals/expiring
 * @access  Admin, Staff
 */
export const getExpiringRenewals = async (req, res, next) => {
    try {
        const { days = 30 } = req.query; // Default check next 30 days
        const daysNum = parseInt(days, 10);
        
        const today = new Date();
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + daysNum);

        const renewals = await PolicyRenewal.find({
            renewalStatus: 'Approved', // Only check active policies
            expiryDate: {
                $gte: today,
                $lte: futureDate
            }
        })
        .populate('customerID', 'name email contactNumber')
        .populate('policyID', 'policyName')
        .populate('vehicleID', 'vehicleNumber')
        .sort({ expiryDate: 1 })
        .lean();

        return successResponse(res, 200, `Found ${renewals.length} expiring policies`, { renewals });
    } catch (error) {
        next(error);
    }
};
