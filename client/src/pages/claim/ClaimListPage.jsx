import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyClaims, clearInsuranceStatus } from '../../store/slices/insuranceSlice';
import PageHeader from '../../components/common/PageHeader';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import { formatDate, formatCurrency } from '../../utils/helpers';
import { AlertTriangle, ChevronRight, FileSearch } from 'lucide-react';
import { Link } from 'react-router-dom';

const ClaimListPage = () => {
    const dispatch = useDispatch();
    const { myClaims: claims, loading, error, success, pagination } = useSelector(
        (state) => state.insurance
    );

    useEffect(() => {
        dispatch(fetchMyClaims({ page: 1, limit: 10 }));
        return () => dispatch(clearInsuranceStatus());
    }, [dispatch]);

    if (loading && claims.length === 0) {
        return <Loader fullScreen text="Fetching your claims..." />;
    }

    return (
        <div>
            <PageHeader
                title="Insurance Claims"
                subtitle="Track the status of your submitted insurance claims"
            >
                <Link
                    to="/claims/new"
                    className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors shadow-sm font-medium"
                >
                    <AlertTriangle className="w-4 h-4" />
                    File New Claim
                </Link>
            </PageHeader>

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

            {claims.length === 0 ? (
                <EmptyState
                    icon={FileSearch}
                    title="No claims filed"
                    description="You haven't filed any insurance claims yet."
                    action={{
                        label: 'File a Claim',
                        onClick: () => window.location.href = '/claims/new'
                    }}
                />
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Claim ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Policy & Vehicle
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Reason
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Outcome
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {claims.map((claim) => (
                                    <tr key={claim._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">
                                            {claim.claimID}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 font-medium">
                                                {claim.policyID?.policyName}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {claim.vehicleID?.vehicleNumber} ({claim.vehicleID?.model})
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 max-w-xs truncate">
                                                {claim.claimReason}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge status={claim.claimStatus} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(claim.claimDate)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                            {claim.claimStatus === 'Approved' ? (
                                                <div className="font-bold text-success">
                                                    {formatCurrency(claim.claimAmount)}
                                                </div>
                                            ) : claim.claimStatus === 'Rejected' ? (
                                                <span className="text-red-500 italic text-xs">Claim Denied</span>
                                            ) : (
                                                <span className="text-gray-400 italic text-xs">Pending assessment</span>
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

export default ClaimListPage;
