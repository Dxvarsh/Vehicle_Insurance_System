import Claim from '../models/Claim.js';
import Premium from '../models/Premium.js';
import InsurancePolicy from '../models/InsurancePolicy.js';
import Vehicle from '../models/Vehicle.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';

/**
 * @desc    Submit a new insurance claim
 * @route   POST /api/claims
 * @access  Customer
 * 
 * Requirement: CLM-01, CLM-02, CLM-03, CLM-226 (Active only)
 */
export const submitClaim = async (req, res, next) => {
  try {
    const { policyID, vehicleID, premiumID, claimReason, supportingDocuments } = req.body;

    // Verify customer
    if (!req.user.linkedCustomerID) {
      return errorResponse(res, 400, 'No customer profile linked to your account');
    }
    const customerID = req.user.linkedCustomerID;

    // Verify active policy (Must be Paid and not expired)
    const premium = await Premium.findOne({
      _id: premiumID,
      policyID,
      vehicleID,
      customerID,
      paymentStatus: 'Paid'
    });

    if (!premium) {
      return errorResponse(res, 400, 'You can only raise a claim for an active and paid policy');
    }

    // Check if there's already a pending claim for this policy
    const existingClaim = await Claim.findOne({
      premiumID,
      claimStatus: { $in: ['Pending', 'Under-Review'] }
    });

    if (existingClaim) {
      return errorResponse(res, 409, 'You already have a claim under process for this policy');
    }

    const claim = await Claim.create({
      customerID,
      policyID,
      vehicleID,
      premiumID,
      claimReason,
      supportingDocuments: supportingDocuments || [],
      claimDate: new Date(),
      claimStatus: 'Pending'
    });

    return successResponse(res, 201, 'Claim submitted successfully', { claim });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all claims with filters
 * @route   GET /api/claims
 * @access  Admin, Staff
 */
export const getAllClaims = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      claimStatus,
      customerID,
      vehicleID,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const filter = {};
    if (claimStatus) filter.claimStatus = claimStatus;
    if (customerID) filter.customerID = customerID;
    if (vehicleID) filter.vehicleID = vehicleID;

    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [claims, total] = await Promise.all([
      Claim.find(filter)
        .populate('customerID', 'name email contactNumber customerID')
        .populate('policyID', 'policyName policyID coverageType')
        .populate('vehicleID', 'vehicleNumber vehicleType model')
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Claim.countDocuments(filter)
    ]);

    return paginatedResponse(res, claims, pageNum, limitNum, total);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get logged-in customer's claims
 * @route   GET /api/claims/my
 * @access  Customer
 */
export const getMyClaims = async (req, res, next) => {
  try {
    if (!req.user.linkedCustomerID) {
      return errorResponse(res, 400, 'No customer profile linked');
    }

    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [claims, total] = await Promise.all([
      Claim.find({ customerID: req.user.linkedCustomerID })
        .populate('policyID', 'policyName policyID coverageType')
        .populate('vehicleID', 'vehicleNumber vehicleType model')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Claim.countDocuments({ customerID: req.user.linkedCustomerID })
    ]);

    return paginatedResponse(res, claims, pageNum, limitNum, total);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get claim by ID
 * @route   GET /api/claims/:id
 * @access  Admin, Staff, Owner
 */
export const getClaimById = async (req, res, next) => {
  try {
    const claim = await Claim.findById(req.params.id)
      .populate('customerID', 'name email contactNumber customerID')
      .populate('policyID', 'policyName policyID coverageType baseAmount')
      .populate('vehicleID', 'vehicleNumber vehicleType model registrationYear')
      .populate('premiumID', 'premiumID calculatedAmount paymentDate')
      .lean();

    if (!claim) {
      return errorResponse(res, 404, 'Claim not found');
    }

    // Ownership check for Customer
    if (req.user.role === 'Customer') {
      if (claim.customerID._id.toString() !== req.user.linkedCustomerID.toString()) {
        return errorResponse(res, 403, 'Unauthorized access to this claim');
      }
    }

    return successResponse(res, 200, 'Claim fetched successfully', { claim });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Approve claim
 * @route   PUT /api/claims/:id/approve
 * @access  Admin
 */
export const approveClaim = async (req, res, next) => {
  try {
    const { claimAmount, adminRemarks } = req.body;

    const claim = await Claim.findById(req.params.id);
    if (!claim) return errorResponse(res, 404, 'Claim not found');

    if (claim.claimStatus === 'Approved') {
      return errorResponse(res, 400, 'Claim is already approved');
    }

    claim.claimStatus = 'Approved';
    claim.claimAmount = claimAmount;
    claim.adminRemarks = adminRemarks;
    claim.processedDate = new Date();

    await claim.save();

    return successResponse(res, 200, 'Claim approved successfully', { claim });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reject claim
 * @route   PUT /api/claims/:id/reject
 * @access  Admin
 */
export const rejectClaim = async (req, res, next) => {
  try {
    const { adminRemarks } = req.body;

    const claim = await Claim.findById(req.params.id);
    if (!claim) return errorResponse(res, 404, 'Claim not found');

    claim.claimStatus = 'Rejected';
    claim.adminRemarks = adminRemarks;
    claim.processedDate = new Date();

    await claim.save();

    return successResponse(res, 200, 'Claim rejected successfully', { claim });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark claim as under review
 * @route   PUT /api/claims/:id/review
 * @access  Admin
 */
export const reviewClaim = async (req, res, next) => {
  try {
    const { adminRemarks } = req.body;

    const claim = await Claim.findById(req.params.id);
    if (!claim) return errorResponse(res, 404, 'Claim not found');

    claim.claimStatus = 'Under-Review';
    if (adminRemarks) claim.adminRemarks = adminRemarks;

    await claim.save();

    return successResponse(res, 200, 'Claim marked as under review', { claim });
  } catch (error) {
    next(error);
  }
};
