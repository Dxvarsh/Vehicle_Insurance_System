import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyRenewals, clearInsuranceStatus } from '../../store/slices/insuranceSlice';
import PageHeader from '../../components/common/PageHeader';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import { formatDate, formatCurrency } from '../../utils/helpers';

const RenewalListPage = () => {
    const dispatch = useDispatch();
    const { myRenewals: renewals, loading, error, success, pagination } = useSelector(
        (state) => state.insurance
    );

    useEffect(() => {
        dispatch(fetchMyRenewals({ page: 1, limit: 10 }));
        return () => dispatch(clearInsuranceStatus());
    }, [dispatch]);

    if (loading && renewals.length === 0) {
        return <Loader fullScreen text="Fetching your renewals..." />;
    }

    return (
        <div>
            <PageHeader
                title="Policy Renewals"
                subtitle="Track and manage your insurance policy renewal requests"
            />

            {error && (
                <Alert
                    type="error"
                    message={error}
                    onClose={() => dispatch(clearInsuranceStatus())}
                    className="mb-6"
                />
            )}
            {success && (
                <Alert
                    type="success"
                    message={success}
                    onClose={() => dispatch(clearInsuranceStatus())}
                    className="mb-6"
                />
            )}

            {renewals.length === 0 ? (
                <EmptyState
                    title="No renewal requests"
                    description="You don't have any active or past renewal requests."
                />
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Renewal ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Policy
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Vehicle
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Dates
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Details
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {renewals.map((renewal) => (
                                    <tr key={renewal._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">
                                            {renewal.renewalID}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 font-medium">
                                                {renewal.policyID?.policyName}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {renewal.policyID?.coverageType}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 font-medium">
                                                {renewal.vehicleID?.model}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {renewal.vehicleID?.vehicleNumber}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-xs text-gray-500">
                                                Requested: {formatDate(renewal.renewalDate)}
                                            </div>
                                            <div className="text-xs text-red-500 font-medium mt-1">
                                                Expires: {formatDate(renewal.expiryDate)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge status={renewal.renewalStatus} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {renewal.premiumID && (
                                                <div className="font-semibold text-gray-900">
                                                    {formatCurrency(renewal.premiumID.calculatedAmount)}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RenewalListPage;
