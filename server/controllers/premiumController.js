import Premium from '../models/Premium.js';
import InsurancePolicy from '../models/InsurancePolicy.js';
import Vehicle from '../models/Vehicle.js';
import PolicyRenewal from '../models/PolicyRenewal.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';

/**
 * @desc    Get all premiums (Admin)
 */
export const getAllPremiums = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, paymentStatus, customerID } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const filter = {};
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (customerID) filter.customerID = customerID;

    const [premiums, total] = await Promise.all([
      Premium.find(filter)
        .populate('customerID', 'name email customerID')
        .populate('policyID', 'policyName policyID')
        .populate('vehicleID', 'vehicleNumber model')
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
      Premium.countDocuments(filter)
    ]);

    return paginatedResponse(res, premiums, pageNum, limitNum, total);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get my premiums
 */
export const getMyPremiums = async (req, res, next) => {
  try {
    if (!req.user.linkedCustomerID) return errorResponse(res, 400, 'No linked customer profile');

    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const [premiums, total] = await Promise.all([
      Premium.find({ customerID: req.user.linkedCustomerID })
        .populate('policyID', 'policyName policyID coverageType policyDuration')
        .populate('vehicleID', 'vehicleNumber model vehicleType')
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
      Premium.countDocuments({ customerID: req.user.linkedCustomerID })
    ]);

    return paginatedResponse(res, premiums, pageNum, limitNum, total);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Process payment (Simulated)
 */
export const processPayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { transactionID } = req.body;

    const premium = await Premium.findById(id);
    if (!premium) return errorResponse(res, 404, 'Premium record not found');

    if (premium.paymentStatus === 'Paid') {
      return errorResponse(res, 400, 'Payment already completed');
    }

    premium.paymentStatus = 'Paid';
    premium.paymentDate = new Date();
    premium.transactionID = transactionID || `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    await premium.save();

    // Update associated Renewal status if any
    await PolicyRenewal.findOneAndUpdate(
      { premiumID: premium._id },
      { renewalStatus: 'Approved' }
    );

    return successResponse(res, 200, 'Payment processed successfully', { premium });
  } catch (error) {
    next(error);
  }
};
