import PolicyRenewal from '../models/PolicyRenewal.js';
import Premium from '../models/Premium.js';
import InsurancePolicy from '../models/InsurancePolicy.js';
import Vehicle from '../models/Vehicle.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';
import { calculatePremium } from '../utils/premiumCalculator.js';

/**
 * @desc    Submit renewal request
 */
export const submitRenewalRequest = async (req, res, next) => {
  try {
    const { policyID, vehicleID, currentPremiumID } = req.body;

    if (!req.user.linkedCustomerID) return errorResponse(res, 400, 'No linked customer profile');
    const customerID = req.user.linkedCustomerID;

    // Check if vehicle and policy exist
    const [policy, vehicle] = await Promise.all([
      InsurancePolicy.findById(policyID),
      Vehicle.findById(vehicleID)
    ]);

    if (!policy || !vehicle) return errorResponse(res, 404, 'Policy or Vehicle not found');

    // Calculate new premium
    const breakdown = calculatePremium(policy, vehicle);

    // Create new premium record for renewal
    const newPremium = await Premium.create({
      policyID,
      vehicleID,
      customerID,
      calculatedAmount: breakdown.finalAmount,
      calculationBreakdown: breakdown,
      paymentStatus: 'Pending'
    });

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

    return successResponse(res, 201, 'Renewal request submitted', { renewal, premium: newPremium });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all renewals
 */
export const getAllRenewals = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, renewalStatus } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const filter = {};
    if (renewalStatus) filter.renewalStatus = renewalStatus;

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
 * @desc    Get my renewals
 */
export const getMyRenewals = async (req, res, next) => {
  try {
    if (!req.user.linkedCustomerID) return errorResponse(res, 400, 'No linked customer profile');

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
 * @desc    Approve renewal
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
 * @desc    Reject renewal
 */
export const rejectRenewal = async (req, res, next) => {
  try {
    const { adminRemarks } = req.body;
    const renewal = await PolicyRenewal.findById(req.params.id);
    if (!renewal) return errorResponse(res, 404, 'Renewal record not found');

    renewal.renewalStatus = 'Rejected';
    renewal.adminRemarks = adminRemarks;
    await renewal.save();

    // Also mark associated premium as Failed/Canceled?
    // For now just leave it.

    return successResponse(res, 200, 'Renewal rejected', { renewal });
  } catch (error) {
    next(error);
  }
};
