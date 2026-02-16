import InsurancePolicy from '../models/InsurancePolicy.js';
import Vehicle from '../models/Vehicle.js';
import Customer from '../models/Customer.js';
import Premium from '../models/Premium.js';
import PolicyRenewal from '../models/PolicyRenewal.js';
import { calculatePremium } from '../utils/premiumCalculator.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * @desc    Create new insurance policy
 * @route   POST /api/policies
 * @access  Admin
 *
 * Requirement: POL-01
 */
export const createPolicy = async (req, res, next) => {
  try {
    const {
      policyName,
      coverageType,
      policyDuration,
      baseAmount,
      description,
      premiumRules,
    } = req.body;

    // Check duplicate policy name
    const existingPolicy = await InsurancePolicy.findOne({
      policyName: { $regex: new RegExp(`^${policyName}$`, 'i') },
    });

    if (existingPolicy) {
      return errorResponse(res, 409, `Policy with name "${policyName}" already exists`);
    }

    // Build policy data
    const policyData = {
      policyName,
      coverageType,
      policyDuration,
      baseAmount,
      description: description || '',
    };

    // Merge premium rules with defaults if provided
    if (premiumRules) {
      policyData.premiumRules = {};

      if (premiumRules.vehicleTypeMultiplier) {
        policyData.premiumRules.vehicleTypeMultiplier = {
          '2-Wheeler': premiumRules.vehicleTypeMultiplier['2-Wheeler'] ?? 0.8,
          '4-Wheeler': premiumRules.vehicleTypeMultiplier['4-Wheeler'] ?? 1.0,
          'Commercial': premiumRules.vehicleTypeMultiplier['Commercial'] ?? 1.5,
        };
      }

      if (premiumRules.ageDepreciation !== undefined) {
        policyData.premiumRules.ageDepreciation = premiumRules.ageDepreciation;
      }

      if (premiumRules.coverageMultiplier) {
        policyData.premiumRules.coverageMultiplier = {
          'Third-Party': premiumRules.coverageMultiplier['Third-Party'] ?? 0.6,
          'Comprehensive': premiumRules.coverageMultiplier['Comprehensive'] ?? 1.0,
          'Own-Damage': premiumRules.coverageMultiplier['Own-Damage'] ?? 0.8,
        };
      }
    }

    const policy = await InsurancePolicy.create(policyData);

    return successResponse(res, 201, 'Insurance policy created successfully', {
      policy,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all policies with search, filter, sort, pagination
 * @route   GET /api/policies
 * @access  All Authenticated
 *
 * Requirements: POL-04 (Customer browse), POL-09 (Filters)
 */
export const getAllPolicies = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      coverageType,
      policyDuration,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      minAmount,
      maxAmount,
    } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const filter = {};

    // For customers, only show active policies
    if (req.user.role === 'Customer') {
      filter.isActive = true;
    } else if (isActive !== undefined && isActive !== '') {
      filter.isActive = isActive === 'true';
    }

    // Search
    if (search) {
      filter.$or = [
        { policyName: { $regex: search, $options: 'i' } },
        { policyID: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Coverage type filter
    if (coverageType) {
      filter.coverageType = coverageType;
    }

    // Duration filter
    if (policyDuration) {
      filter.policyDuration = parseInt(policyDuration, 10);
    }

    // Amount range filter
    if (minAmount || maxAmount) {
      filter.baseAmount = {};
      if (minAmount) filter.baseAmount.$gte = parseFloat(minAmount);
      if (maxAmount) filter.baseAmount.$lte = parseFloat(maxAmount);
    }

    // Sort
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute
    const [policies, total] = await Promise.all([
      InsurancePolicy.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      InsurancePolicy.countDocuments(filter),
    ]);

    // Convert Map fields to plain objects for JSON response
    const formattedPolicies = policies.map((policy) => ({
      ...policy,
      premiumRules: {
        vehicleTypeMultiplier: policy.premiumRules?.vehicleTypeMultiplier || { '2-Wheeler': 0.8, '4-Wheeler': 1.0, 'Commercial': 1.5 },
        ageDepreciation: policy.premiumRules?.ageDepreciation ?? 2,
        coverageMultiplier: policy.premiumRules?.coverageMultiplier || { 'Third-Party': 0.6, 'Comprehensive': 1.0, 'Own-Damage': 0.8 },
      },
    }));

    return paginatedResponse(res, formattedPolicies, pageNum, limitNum, total);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get policy by ID
 * @route   GET /api/policies/:id
 * @access  All Authenticated
 *
 * Requirement: POL-05
 */
export const getPolicyById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const policy = await InsurancePolicy.findById(id).lean();

    if (!policy) {
      return errorResponse(res, 404, 'Policy not found');
    }

    // For customers, only show active policies
    if (req.user.role === 'Customer' && !policy.isActive) {
      return errorResponse(res, 404, 'Policy not found');
    }

    // Format premium rules
    const formattedPolicy = {
      ...policy,
      premiumRules: {
        vehicleTypeMultiplier: policy.premiumRules?.vehicleTypeMultiplier || { '2-Wheeler': 0.8, '4-Wheeler': 1.0, 'Commercial': 1.5 },
        ageDepreciation: policy.premiumRules?.ageDepreciation ?? 2,
        coverageMultiplier: policy.premiumRules?.coverageMultiplier || { 'Third-Party': 0.6, 'Comprehensive': 1.0, 'Own-Damage': 0.8 },
      },
    };

    // Get purchase statistics for admin
    let purchaseStats = null;
    if (req.user.role === 'Admin' || req.user.role === 'Staff') {
      const [totalPurchases, totalRevenue] = await Promise.all([
        Premium.countDocuments({ policyID: id, paymentStatus: 'Paid' }),
        Premium.aggregate([
          { $match: { policyID: policy._id, paymentStatus: 'Paid' } },
          { $group: { _id: null, total: { $sum: '$calculatedAmount' } } },
        ]),
      ]);

      purchaseStats = {
        totalPurchases,
        totalRevenue: totalRevenue[0]?.total || 0,
      };
    }

    return successResponse(res, 200, 'Policy fetched successfully', {
      policy: formattedPolicy,
      purchaseStats,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update policy
 * @route   PUT /api/policies/:id
 * @access  Admin
 *
 * Requirement: POL-02
 */
export const updatePolicy = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      policyName,
      coverageType,
      policyDuration,
      baseAmount,
      description,
      premiumRules,
    } = req.body;

    const policy = await InsurancePolicy.findById(id);

    if (!policy) {
      return errorResponse(res, 404, 'Policy not found');
    }

    // Check duplicate name if changing
    if (policyName && policyName !== policy.policyName) {
      const duplicate = await InsurancePolicy.findOne({
        policyName: { $regex: new RegExp(`^${policyName}$`, 'i') },
        _id: { $ne: id },
      });
      if (duplicate) {
        return errorResponse(res, 409, `Policy with name "${policyName}" already exists`);
      }
      policy.policyName = policyName;
    }

    // Update simple fields
    if (coverageType) policy.coverageType = coverageType;
    if (policyDuration) policy.policyDuration = policyDuration;
    if (baseAmount !== undefined) policy.baseAmount = baseAmount;
    if (description !== undefined) policy.description = description;

    // Update premium rules
    if (premiumRules) {
      if (premiumRules.vehicleTypeMultiplier) {
        const current = policy.premiumRules.vehicleTypeMultiplier || new Map();
        Object.entries(premiumRules.vehicleTypeMultiplier).forEach(([key, val]) => {
          current.set(key, val);
        });
        policy.premiumRules.vehicleTypeMultiplier = current;
      }

      if (premiumRules.ageDepreciation !== undefined) {
        policy.premiumRules.ageDepreciation = premiumRules.ageDepreciation;
      }

      if (premiumRules.coverageMultiplier) {
        const current = policy.premiumRules.coverageMultiplier || new Map();
        Object.entries(premiumRules.coverageMultiplier).forEach(([key, val]) => {
          current.set(key, val);
        });
        policy.premiumRules.coverageMultiplier = current;
      }
    }

    policy.markModified('premiumRules');
    await policy.save();

    // Fetch fresh and format
    const updated = await InsurancePolicy.findById(id).lean();
    const formattedPolicy = {
      ...updated,
      premiumRules: {
        vehicleTypeMultiplier: updated.premiumRules?.vehicleTypeMultiplier
          ? Object.fromEntries(updated.premiumRules.vehicleTypeMultiplier)
          : {},
        ageDepreciation: updated.premiumRules?.ageDepreciation ?? 2,
        coverageMultiplier: updated.premiumRules?.coverageMultiplier
          ? Object.fromEntries(updated.premiumRules.coverageMultiplier)
          : {},
      },
    };

    return successResponse(res, 200, 'Policy updated successfully', {
      policy: formattedPolicy,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Deactivate/Activate policy (soft delete)
 * @route   DELETE /api/policies/:id
 * @access  Admin
 *
 * Requirement: POL-03
 */
export const togglePolicyStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    const policy = await InsurancePolicy.findById(id);

    if (!policy) {
      return errorResponse(res, 404, 'Policy not found');
    }

    // Toggle status
    policy.isActive = !policy.isActive;
    await policy.save();

    const statusText = policy.isActive ? 'activated' : 'deactivated';

    return successResponse(res, 200, `Policy ${statusText} successfully`, {
      policy: {
        _id: policy._id,
        policyID: policy.policyID,
        policyName: policy.policyName,
        isActive: policy.isActive,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Calculate premium preview (without purchasing)
 * @route   POST /api/policies/calculate-premium
 * @access  Customer, Staff
 *
 * Requirements: PREM-01, PREM-02, PREM-03
 */
export const calculatePremiumPreview = async (req, res, next) => {
  try {
    const { policyID, vehicleID } = req.body;

    // Find policy
    const policy = await InsurancePolicy.findById(policyID).lean();
    if (!policy) {
      return errorResponse(res, 404, 'Policy not found');
    }
    if (!policy.isActive) {
      return errorResponse(res, 400, 'This policy is no longer active');
    }

    // Find vehicle
    const vehicle = await Vehicle.findById(vehicleID).lean();
    if (!vehicle) {
      return errorResponse(res, 404, 'Vehicle not found');
    }

    // Ownership check for Customer
    if (req.user.role === 'Customer') {
      if (
        !req.user.linkedCustomerID ||
        req.user.linkedCustomerID.toString() !== vehicle.customerID.toString()
      ) {
        return errorResponse(res, 403, 'You can only calculate premium for your own vehicles');
      }
    }

    // Calculate premium
    const breakdown = calculatePremium(policy, vehicle);

    return successResponse(res, 200, 'Premium calculated successfully', {
      policy: {
        _id: policy._id,
        policyID: policy.policyID,
        policyName: policy.policyName,
        coverageType: policy.coverageType,
        policyDuration: policy.policyDuration,
        baseAmount: policy.baseAmount,
      },
      vehicle: {
        _id: vehicle._id,
        vehicleID: vehicle.vehicleID,
        vehicleNumber: vehicle.vehicleNumber,
        vehicleType: vehicle.vehicleType,
        model: vehicle.model,
        registrationYear: vehicle.registrationYear,
      },
      premiumBreakdown: breakdown,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Purchase policy for a vehicle
 * @route   POST /api/policies/:id/purchase
 * @access  Customer
 *
 * Requirements: POL-06, POL-07
 */
export const purchasePolicy = async (req, res, next) => {
  try {
    const { id: policyID } = req.params;
    const { vehicleID } = req.body;

    // Verify customer
    if (!req.user.linkedCustomerID) {
      return errorResponse(res, 400, 'No customer profile linked to your account');
    }

    const customerID = req.user.linkedCustomerID;

    // Find policy
    const policy = await InsurancePolicy.findById(policyID);
    if (!policy) {
      return errorResponse(res, 404, 'Policy not found');
    }
    if (!policy.isActive) {
      return errorResponse(res, 400, 'This policy is no longer active and cannot be purchased');
    }

    // Find vehicle
    const vehicle = await Vehicle.findById(vehicleID);
    if (!vehicle) {
      return errorResponse(res, 404, 'Vehicle not found');
    }

    // Verify vehicle belongs to customer
    if (vehicle.customerID.toString() !== customerID.toString()) {
      return errorResponse(res, 403, 'This vehicle does not belong to you');
    }

    // Check if vehicle already has this exact policy active
    const existingPremium = await Premium.findOne({
      policyID,
      vehicleID,
      customerID,
      paymentStatus: { $in: ['Paid', 'Pending'] },
    });

    if (existingPremium) {
      if (existingPremium.paymentStatus === 'Paid') {
        return errorResponse(
          res,
          409,
          'You already have an active policy of this type for this vehicle'
        );
      }
      if (existingPremium.paymentStatus === 'Pending') {
        return errorResponse(
          res,
          409,
          'You already have a pending payment for this policy. Please complete the existing payment.'
        );
      }
    }

    // Check if vehicle already has same coverage type active
    const existingCoverage = await Premium.findOne({
      vehicleID,
      customerID,
      paymentStatus: 'Paid',
    }).populate('policyID', 'coverageType');

    if (
      existingCoverage &&
      existingCoverage.policyID?.coverageType === policy.coverageType
    ) {
      return errorResponse(
        res,
        409,
        `Vehicle already has an active ${policy.coverageType} coverage. You can renew it instead.`
      );
    }

    // Calculate premium
    const breakdown = calculatePremium(policy, vehicle);

    // Create premium record (Pending payment)
    const premium = await Premium.create({
      policyID,
      vehicleID,
      customerID,
      calculatedAmount: breakdown.finalAmount,
      calculationBreakdown: {
        baseAmount: breakdown.baseAmount,
        vehicleTypeMultiplier: breakdown.vehicleTypeMultiplier,
        coverageMultiplier: breakdown.coverageMultiplier,
        ageDepreciation: breakdown.ageDepreciation,
        finalAmount: breakdown.finalAmount,
      },
      paymentStatus: 'Pending',
    });

    // Create renewal record
    const renewalDate = new Date();
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + policy.policyDuration);

    const renewal = await PolicyRenewal.create({
      policyID,
      premiumID: premium._id,
      vehicleID,
      customerID,
      renewalDate,
      expiryDate,
      renewalStatus: 'Pending',
    });

    // Populate premium for response
    const populatedPremium = await Premium.findById(premium._id)
      .populate('policyID', 'policyID policyName coverageType policyDuration')
      .populate('vehicleID', 'vehicleID vehicleNumber vehicleType model')
      .populate('customerID', 'customerID name email')
      .lean();

    return successResponse(res, 201, 'Policy purchased successfully. Please complete payment.', {
      premium: populatedPremium,
      renewal: {
        _id: renewal._id,
        renewalID: renewal.renewalID,
        renewalDate,
        expiryDate,
        renewalStatus: renewal.renewalStatus,
      },
      premiumBreakdown: breakdown,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get policy statistics
 * @route   GET /api/policies/stats
 * @access  Admin, Staff
 */
export const getPolicyStats = async (req, res, next) => {
  try {
    const [
      totalPolicies,
      activePolicies,
      inactivePolicies,
      thirdPartyCount,
      comprehensiveCount,
      ownDamageCount,
      totalPurchases,
      totalRevenue,
      avgPremium,
    ] = await Promise.all([
      InsurancePolicy.countDocuments(),
      InsurancePolicy.countDocuments({ isActive: true }),
      InsurancePolicy.countDocuments({ isActive: false }),
      InsurancePolicy.countDocuments({ coverageType: 'Third-Party', isActive: true }),
      InsurancePolicy.countDocuments({ coverageType: 'Comprehensive', isActive: true }),
      InsurancePolicy.countDocuments({ coverageType: 'Own-Damage', isActive: true }),
      Premium.countDocuments({ paymentStatus: 'Paid' }),
      Premium.aggregate([
        { $match: { paymentStatus: 'Paid' } },
        { $group: { _id: null, total: { $sum: '$calculatedAmount' } } },
      ]),
      Premium.aggregate([
        { $match: { paymentStatus: 'Paid' } },
        { $group: { _id: null, avg: { $avg: '$calculatedAmount' } } },
      ]),
    ]);

    // Purchases by coverage type
    const purchasesByCoverage = await Premium.aggregate([
      { $match: { paymentStatus: 'Paid' } },
      {
        $lookup: {
          from: 'insurancepolicies',
          localField: 'policyID',
          foreignField: '_id',
          as: 'policy',
        },
      },
      { $unwind: '$policy' },
      {
        $group: {
          _id: '$policy.coverageType',
          count: { $sum: 1 },
          revenue: { $sum: '$calculatedAmount' },
        },
      },
    ]);

    // Duration distribution
    const durationDistribution = await InsurancePolicy.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$policyDuration',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return successResponse(res, 200, 'Policy stats fetched successfully', {
      policies: {
        total: totalPolicies,
        active: activePolicies,
        inactive: inactivePolicies,
      },
      byCoverageType: {
        'Third-Party': thirdPartyCount,
        'Comprehensive': comprehensiveCount,
        'Own-Damage': ownDamageCount,
      },
      purchases: {
        total: totalPurchases,
        totalRevenue: totalRevenue[0]?.total || 0,
        averagePremium: Math.round(avgPremium[0]?.avg || 0),
        byCoverage: purchasesByCoverage,
      },
      durationDistribution: durationDistribution.map((d) => ({
        months: d._id,
        count: d.count,
      })),
    });
  } catch (error) {
    next(error);
  }
};