import Claim from '../models/Claim.js';
import Premium from '../models/Premium.js';
import Notification from '../models/Notification.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';

/**
 * @desc    Submit a new insurance claim
 * @route   POST /api/claims
 * @access  Customer
 */
export const submitClaim = async (req, res, next) => {
  try {
    const { policyID, vehicleID, premiumID, claimReason, supportingDocuments } = req.body;

    if (!req.user.linkedCustomerID) {
      return errorResponse(res, 400, 'No linked customer profile');
    }
    const customerID = req.user.linkedCustomerID;

    // Verify policy eligibility (must be active/paid)
    const premium = await Premium.findOne({
      _id: premiumID,
      customerID,
      policyID,
      vehicleID,
      paymentStatus: 'Paid'
    });

    if (!premium) {
      return errorResponse(res, 400, 'Claim can only be raised on active, paid policies');
    }

    const claim = await Claim.create({
      customerID,
      policyID,
      vehicleID,
      premiumID,
      claimReason,
      supportingDocuments: supportingDocuments || [],
      claimDate: new Date()
    });

    return successResponse(res, 201, 'Claim submitted successfully', { claim });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all claims (Admin/Staff)
 * @route   GET /api/claims
 * @access  Admin, Staff
 */
export const getAllClaims = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, claimStatus, search } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const filter = {};
    if (claimStatus) filter.claimStatus = claimStatus;

    const [claims, total] = await Promise.all([
      Claim.find(filter)
        .populate('customerID', 'name email customerID')
        .populate('policyID', 'policyName policyID')
        .populate('vehicleID', 'vehicleNumber model')
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
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
 * @desc    Get my claims (Customer)
 * @route   GET /api/claims/my
 * @access  Customer
 */
export const getMyClaims = async (req, res, next) => {
  try {
    if (!req.user.linkedCustomerID) {
      return errorResponse(res, 400, 'No linked customer profile');
    }

    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const [claims, total] = await Promise.all([
      Claim.find({ customerID: req.user.linkedCustomerID })
        .populate('policyID', 'policyName policyID coverageType')
        .populate('vehicleID', 'vehicleNumber model')
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
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
 * @access  Protected
 */
export const getClaimById = async (req, res, next) => {
  try {
    const claim = await Claim.findById(req.params.id)
      .populate('customerID', 'name email contactNumber customerID')
      .populate('policyID', 'policyName policyID coverageType description')
      .populate('vehicleID', 'vehicleNumber model vehicleType registrationYear')
      .populate('premiumID', 'calculatedAmount paymentStatus calculationBreakdown');

    if (!claim) {
      return errorResponse(res, 404, 'Claim record not found');
    }

    // Access Control
    if (req.user.role === 'Customer') {
      if (claim.customerID._id.toString() !== req.user.linkedCustomerID?.toString()) {
        return errorResponse(res, 403, 'Unauthorized access to this claim');
      }
    }

    return successResponse(res, 200, 'Claim details fetched', { claim });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Process a claim (Approve/Reject/Review)
 * @route   PUT /api/claims/:id/process
 * @access  Admin
 */
export const processClaim = async (req, res, next) => {
  try {
    const { claimStatus, claimAmount, adminRemarks } = req.body;
    
    const claim = await Claim.findById(req.params.id)
      .populate('policyID', 'policyName');

    if (!claim) return errorResponse(res, 404, 'Claim record not found');

    if (claimStatus === 'Approved') {
      claim.claimAmount = claimAmount;
    }
    
    claim.claimStatus = claimStatus;
    claim.adminRemarks = adminRemarks;
    claim.processedDate = new Date();
    
    await claim.save();

    // Notify Customer
    await Notification.create({
      customerID: claim.customerID,
      messageType: 'Claim-Update',
      title: 'Claim Status Updated',
      message: `Your claim (${claim.claimID}) for policy "${claim.policyID.policyName}" has been updated to "${claimStatus}". ${adminRemarks ? 'Remarks: ' + adminRemarks : ''}`
    });

    return successResponse(res, 200, `Claim ${claimStatus.toLowerCase()} successfully`, { claim });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get claim statistics (Admin)
 * @route   GET /api/claims/stats
 * @access  Admin, Staff
 */
export const getClaimStats = async (req, res, next) => {
  try {
    const stats = await Claim.aggregate([
      {
        $group: {
          _id: '$claimStatus',
          count: { $sum: 1 },
          totalAmount: { $sum: '$claimAmount' }
        }
      }
    ]);

    const formattedStats = {
      total: 0,
      approved: { count: 0, amount: 0 },
      pending: { count: 0 },
      rejected: { count: 0 },
      underReview: { count: 0 }
    };

    stats.forEach(stat => {
      formattedStats.total += stat.count;
      switch (stat._id) {
        case 'Approved':
          formattedStats.approved = { count: stat.count, amount: stat.totalAmount };
          break;
        case 'Pending':
          formattedStats.pending = { count: stat.count };
          break;
        case 'Rejected':
          formattedStats.rejected = { count: stat.count };
          break;
        case 'Under-Review':
          formattedStats.underReview = { count: stat.count };
          break;
      }
    });

    return successResponse(res, 200, 'Claim statistics fetched', { stats: formattedStats });
  } catch (error) {
    next(error);
  }
};
