import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { submitClaim, clearInsuranceStatus } from '../../store/slices/insuranceSlice';
import { fetchCustomerDashboard } from '../../store/slices/customerSlice';
import { selectAuth } from '../../store/slices/authSlice';
import PageHeader from '../../components/common/PageHeader';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import { Shield, Car, AlertTriangle, Upload, CheckCircle } from 'lucide-react';

const ClaimRequestPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { customer } = useSelector(selectAuth);
    const { dashboard, isDashboardLoading } = useSelector((state) => state.customer);
    const { btnLoading, error, success } = useSelector((state) => state.insurance);

    const [selectedPolicy, setSelectedPolicy] = useState(null);
    const [reason, setReason] = useState('');
    const [step, setStep] = useState(1); // 1: Select Policy, 2: Details

    useEffect(() => {
        if (customer?._id) {
            dispatch(fetchCustomerDashboard(customer._id));
        }
        return () => dispatch(clearInsuranceStatus());
    }, [dispatch, customer?._id]);

    const activePolicies = dashboard?.summary?.policies?.recentActive || [];

    const handlePolicySelect = (policy) => {
        setSelectedPolicy(policy);
        setStep(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (reason.length < 10) {
            return;
        }

        const data = {
            policyID: selectedPolicy.policyID._id,
            vehicleID: selectedPolicy.vehicleID._id,
            premiumID: selectedPolicy._id,
            claimReason: reason,
        };

        const result = await dispatch(submitClaim(data));
        if (submitClaim.fulfilled.match(result)) {
            setTimeout(() => {
                navigate('/claims');
            }, 2000);
        }
    };

    if (isDashboardLoading) {
        return <Loader fullScreen text="Loading your active policies..." />;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <PageHeader
                title="File an Insurance Claim"
                subtitle={step === 1 ? "Step 1: Select the insured policy" : "Step 2: Provide claim details"}
            />

            {error && <Alert type="error" message={error} onClose={() => dispatch(clearInsuranceStatus())} className="mb-6" />}
            {success && <Alert type="success" message={success} onClose={() => dispatch(clearInsuranceStatus())} className="mb-6" />}

            {step === 1 ? (
                <div className="space-y-4">
                    {activePolicies.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                            <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No active policies eligible for claims</h3>
                            <p className="text-gray-500 mb-6">You need an active, paid insurance policy to file a claim.</p>
                        </div>
                    ) : (
                        activePolicies.map((policy) => (
                            <div
                                key={policy._id}
                                onClick={() => handlePolicySelect(policy)}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between cursor-pointer hover:border-primary-500 hover:shadow-md transition-all group"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                                        <Shield className="w-6 h-6 text-primary-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900">{policy.policyID?.policyName}</h4>
                                        <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
                                            <Car className="w-4 h-4" />
                                            <span>{policy.vehicleID?.vehicleNumber} • {policy.vehicleID?.model}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-primary-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                    Select <CheckCircle className="w-4 h-4" />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    <div className="mb-8 flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                            <Shield className="w-5 h-5 text-primary-500" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Claiming against</p>
                            <p className="text-sm font-bold text-gray-900">
                                {selectedPolicy.policyID?.policyName} for {selectedPolicy.vehicleID?.vehicleNumber}
                            </p>
                        </div>
                        <button
                            onClick={() => setStep(1)}
                            className="ml-auto text-xs text-primary-600 hover:underline font-bold"
                        >
                            Change Policy
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Describe the incident <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                required
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                rows="5"
                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all ${reason.length > 0 && reason.length < 10 ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                placeholder="Please provide a detailed description of how the damage occurred..."
                            ></textarea>
                            <p className={`text-xs mt-2 ${reason.length >= 10 ? 'text-gray-400' : 'text-red-500'}`}>
                                Minimum 10 characters required. Current: {reason.length}
                            </p>
                        </div>

                        <div className="p-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 text-center">
                            <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                            <p className="text-sm font-medium text-gray-600">Supporting Documents (Optional)</p>
                            <p className="text-xs text-gray-400 mt-1">Images of damage, police reports, etc.</p>
                            <button type="button" className="mt-4 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
                                Add Files
                            </button>
                        </div>

                        <div className="flex items-center gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="px-6 py-2.5 text-gray-700 font-bold hover:text-gray-900 transition-colors"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={btnLoading || reason.length < 10}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white rounded-xl font-bold shadow-lg shadow-primary-200 transition-all active:scale-[0.98]"
                            >
                                {btnLoading ? 'Submitting...' : (
                                    <>
                                        <AlertTriangle className="w-5 h-5" />
                                        Submit Claim
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ClaimRequestPage;
