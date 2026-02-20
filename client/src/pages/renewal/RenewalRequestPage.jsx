import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { submitRenewal, clearInsuranceStatus } from '../../store/slices/insuranceSlice';
import { fetchCustomerDashboard } from '../../store/slices/customerSlice';
import { selectAuth } from '../../store/slices/authSlice';
import PageHeader from '../../components/common/PageHeader';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import Badge from '../../components/common/Badge';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { RefreshCw, Car, Shield } from 'lucide-react';

const RenewalRequestPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { customer } = useSelector(selectAuth);
    const { dashboard, isDashboardLoading } = useSelector((state) => state.customer);
    const { btnLoading, error, success } = useSelector((state) => state.insurance);

    useEffect(() => {
        if (customer?._id) {
            dispatch(fetchCustomerDashboard(customer._id));
        }
    }, [dispatch, customer?._id]);

    const activePolicies = dashboard?.summary?.policies?.recentActive || [];

    const handleRenew = async (policy) => {
        const data = {
            policyID: policy.policyID._id,
            vehicleID: policy.vehicleID._id,
        };
        const result = await dispatch(submitRenewal(data));
        if (submitRenewal.fulfilled.match(result)) {
            setTimeout(() => {
                navigate('/renewals');
            }, 1500);
        }
    };

    if (isDashboardLoading) {
        return <Loader fullScreen text="Loading your policies..." />;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <PageHeader
                title="Initiate Renewal"
                subtitle="Select an active policy to request a renewal"
            />

            {error && <Alert type="error" message={error} onClose={() => dispatch(clearInsuranceStatus())} className="mb-6" />}
            {success && <Alert type="success" message={success} onClose={() => dispatch(clearInsuranceStatus())} className="mb-6" />}

            {activePolicies.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No active policies found</h3>
                    <p className="text-gray-500 mb-6">You need an active policy to initiate a renewal request.</p>
                    <button
                        onClick={() => navigate('/policies')}
                        className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    >
                        Browse Policies
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {activePolicies.map((policy) => (
                        <div key={policy._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-primary-300 transition-colors">
                            <div className="flex items-start gap-4 flex-1">
                                <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Shield className="w-6 h-6 text-primary-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-lg font-bold text-gray-900 truncate">
                                        {policy.policyID?.policyName}
                                    </h4>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                            <Car className="w-4 h-4" />
                                            <span>{policy.vehicleID?.vehicleNumber} • {policy.vehicleID?.model}</span>
                                        </div>
                                        <div className="text-sm font-semibold text-primary-600">
                                            {formatCurrency(policy.calculatedAmount)}
                                        </div>
                                    </div>
                                    <p className="text-xs text-text-tertiary mt-2 italic">
                                        Policy valid since {formatDate(policy.paymentDate)}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => handleRenew(policy)}
                                disabled={btnLoading}
                                className="flex items-center gap-2 px-6 py-2.5 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white rounded-lg font-semibold shadow-md transition-all active:scale-95 whitespace-nowrap"
                            >
                                <RefreshCw className={`w-4 h-4 ${btnLoading ? 'animate-spin' : ''}`} />
                                {btnLoading ? 'Submitting...' : 'Initiate Renewal'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RenewalRequestPage;
