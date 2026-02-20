import Customer from '../models/Customer.js';
import InsurancePolicy from '../models/InsurancePolicy.js';
import PolicyRenewal from '../models/PolicyRenewal.js';
import Claim from '../models/Claim.js';
import Premium from '../models/Premium.js';
import { successResponse } from '../utils/apiResponse.js';

/**
 * @desc    Get Admin Dashboard Statistics
 * @route   GET /api/dashboard/stats
 * @access  Admin, Staff
 */
export const getAdminStats = async (req, res, next) => {
    try {
        const [
            totalCustomers,
            activeRenewals,
            totalPremiumCollected,
            totalClaimsPaid
        ] = await Promise.all([
            Customer.countDocuments(),
            PolicyRenewal.countDocuments({ renewalStatus: 'Approved' }),
            Premium.aggregate([
                { $match: { paymentStatus: 'Paid' } },
                { $group: { _id: null, total: { $sum: '$calculatedAmount' } } }
            ]),
            Claim.aggregate([
                { $match: { claimStatus: 'Approved' } },
                { $group: { _id: null, total: { $sum: '$claimAmount' } } }
            ])
        ]);

        return successResponse(res, 200, 'Dashboard stats fetched', {
            customers: totalCustomers,
            activePolicies: activeRenewals,
            premiumCollected: totalPremiumCollected[0]?.total || 0,
            claimsPaid: totalClaimsPaid[0]?.total || 0
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get Admin Dashboard Chart Data
 * @route   GET /api/dashboard/charts
 * @access  Admin, Staff
 */
export const getChartData = async (req, res, next) => {
    try {
        // 1. Policy Distribution by Coverage Type
        const policyDistribution = await PolicyRenewal.aggregate([
            { $match: { renewalStatus: 'Approved' } },
            {
                $lookup: {
                    from: 'insurancepolicies',
                    localField: 'policyID',
                    foreignField: '_id',
                    as: 'policy'
                }
            },
            { $unwind: '$policy' },
            {
                $group: {
                    _id: '$policy.coverageType',
                    count: { $sum: 1 }
                }
            },
            { $project: { name: '$_id', value: '$count', _id: 0 } }
        ]);

        // 2. Monthly Premium Collections (Last 6 Months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);

        const monthlyPremiums = await Premium.aggregate([
            {
                $match: {
                    paymentStatus: 'Paid',
                    paymentDate: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: '$paymentDate' },
                        year: { $year: '$paymentDate' }
                    },
                    total: { $sum: '$calculatedAmount' }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        // 3. Claim Status Breakdown
        const claimBreakdown = await Claim.aggregate([
            {
                $group: {
                    _id: '$claimStatus',
                    count: { $sum: 1 }
                }
            },
            { $project: { status: '$_id', count: '$count', _id: 0 } }
        ]);

        return successResponse(res, 200, 'Chart data fetched', {
            policyDistribution,
            monthlyPremiums: monthlyPremiums.map(item => ({
                month: new Date(item._id.year, item._id.month - 1).toLocaleString('default', { month: 'short' }),
                amount: item.total
            })),
            claimBreakdown
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get Report Data
 * @route   GET /api/dashboard/reports
 * @access  Admin
 */
export const getReportsData = async (req, res, next) => {
    try {
        const { type } = req.query;

        let data = [];
        if (type === 'policies') {
            data = await PolicyRenewal.find()
                .populate('customerID', 'name email customerID')
                .populate('policyID', 'policyName coverageType policyID')
                .populate('vehicleID', 'vehicleNumber model')
                .sort({ renewalDate: -1 })
                .limit(50);
        } else if (type === 'premiums') {
            data = await Premium.find({ paymentStatus: 'Paid' })
                .populate('customerID', 'name customerID')
                .populate('policyID', 'policyName')
                .sort({ paymentDate: -1 })
                .limit(50);
        } else if (type === 'claims') {
            data = await Claim.find()
                .populate('customerID', 'name customerID')
                .populate('policyID', 'policyName')
                .sort({ claimDate: -1 })
                .limit(50);
        }

        return successResponse(res, 200, `${type} report fetched`, { data });
    } catch (error) {
        next(error);
    }
};
