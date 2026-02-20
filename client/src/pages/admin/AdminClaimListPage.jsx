import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllClaims, processClaim, clearInsuranceStatus, fetchClaimStats } from '../../store/slices/insuranceSlice';
import PageHeader from '../../components/common/PageHeader';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { formatDate, formatCurrency } from '../../utils/helpers';
import { Filter, Search, CheckCircle, XCircle, Clock, Eye, MessageSquare, IndianRupee } from 'lucide-react';

const AdminClaimListPage = () => {
    const dispatch = useDispatch();
    const { claims, claimStats, loading, btnLoading, error, success, pagination } = useSelector(
        (state) => state.insurance
    );

    const [processingId, setProcessingId] = useState(null);
    const [processData, setProcessData] = useState({ status: '', amount: '', remarks: '' });
    const [showProcessModal, setShowProcessModal] = useState(false);
    const [filters, setFilters] = useState({ claimStatus: '', search: '' });

    useEffect(() => {
        dispatch(fetchAllClaims(filters));
        dispatch(fetchClaimStats());
        return () => dispatch(clearInsuranceStatus());
    }, [dispatch]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const applyFilters = () => {
        dispatch(fetchAllClaims(filters));
    };

    const handleOpenProcess = (claim) => {
        setProcessingId(claim._id);
        setProcessData({
            status: claim.claimStatus === 'Pending' ? 'Under-Review' : claim.claimStatus,
            amount: claim.policyID?.baseAmount || '',
            remarks: claim.adminRemarks || ''
        });
        setShowProcessModal(true);
    };

    const handleProcessSubmit = async (e) => {
        if (e) e.preventDefault();
        const result = await dispatch(processClaim({
            id: processingId,
            claimStatus: processData.status,
            claimAmount: processData.status === 'Approved' ? Number(processData.amount) : null,
            adminRemarks: processData.remarks
        }));

        if (processClaim.fulfilled.match(result)) {
            setShowProcessModal(false);
            dispatch(fetchAllClaims(filters));
            dispatch(fetchClaimStats());
        }
    };

    if (loading && claims.length === 0) {
        return <Loader fullScreen text="Loading claims management..." />;
    }

    return (
        <div>
            <PageHeader
                title="Manage Claims"
                subtitle="Review and process customer insurance claims"
            />

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatCard
                    label="Total Claims"
                    value={claimStats?.total || 0}
                    icon={Eye}
                    color="primary"
                />
                <StatCard
                    label="Pending"
                    value={claimStats?.pending?.count || 0}
                    icon={Clock}
                    color="yellow"
                />
                <StatCard
                    label="Settlements"
                    value={formatCurrency(claimStats?.approved?.amount || 0)}
                    icon={IndianRupee}
                    color="green"
                />
                <StatCard
                    label="Under Review"
                    value={claimStats?.underReview?.count || 0}
                    icon={Filter}
                    color="purple"
                />
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        name="search"
                        value={filters.search}
                        onChange={handleFilterChange}
                        placeholder="Search by Claim ID, Customer or Vehicle..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition-all"
                    />
                </div>
                <select
                    name="claimStatus"
                    value={filters.claimStatus}
                    onChange={handleFilterChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                    <option value="">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Under-Review">Under-Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                </select>
                <button
                    onClick={applyFilters}
                    className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors font-semibold"
                >
                    Apply Filters
                </button>
            </div>

            {error && <Alert type="error" message={error} onClose={() => dispatch(clearInsuranceStatus())} className="mb-6" />}
            {success && <Alert type="success" message={success} onClose={() => dispatch(clearInsuranceStatus())} className="mb-6" />}

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Claim</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Policy/Vehicle</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {claims.map((claim) => (
                                <tr key={claim._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-bold text-primary-600">{claim.claimID}</div>
                                        <div className="text-xs text-gray-400 mt-0.5">{formatDate(claim.claimDate)}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-bold text-gray-900">{claim.customerID?.name}</div>
                                        <div className="text-xs text-gray-500">{claim.customerID?.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{claim.policyID?.policyName}</div>
                                        <div className="text-xs text-gray-500">{claim.vehicleID?.vehicleNumber} ({claim.vehicleID?.model})</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge status={claim.claimStatus} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(claim.createdAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <button
                                            onClick={() => handleOpenProcess(claim)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-all font-bold text-sm"
                                        >
                                            <Eye className="w-4 h-4" />
                                            Process
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Process Modal */}
            <Modal
                isOpen={showProcessModal}
                onClose={() => setShowProcessModal(false)}
                title="Process Claim"
                size="lg"
                footer={
                    <div className="flex items-center justify-end gap-3 w-full">
                        <button
                            type="button"
                            onClick={() => setShowProcessModal(false)}
                            className="px-6 py-2 border border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleProcessSubmit}
                            disabled={btnLoading}
                            className="px-6 py-2 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 disabled:bg-gray-300 transition-all"
                        >
                            {btnLoading ? 'Updating...' : 'Save Decision'}
                        </button>
                    </div>
                }
            >
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2.5">Decision</label>
                        <div className="grid grid-cols-3 gap-3">
                            <StatusOption
                                label="Review"
                                active={processData.status === 'Under-Review'}
                                onClick={() => setProcessData(p => ({ ...p, status: 'Under-Review' }))}
                                icon={Clock}
                                color="purple"
                            />
                            <StatusOption
                                label="Approve"
                                active={processData.status === 'Approved'}
                                onClick={() => setProcessData(p => ({ ...p, status: 'Approved' }))}
                                icon={CheckCircle}
                                color="green"
                            />
                            <StatusOption
                                label="Reject"
                                active={processData.status === 'Rejected'}
                                onClick={() => setProcessData(p => ({ ...p, status: 'Rejected' }))}
                                icon={XCircle}
                                color="red"
                            />
                        </div>
                    </div>

                    {processData.status === 'Approved' && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Settlement Amount (₹)</label>
                            <div className="relative">
                                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="number"
                                    required
                                    value={processData.amount}
                                    onChange={(e) => setProcessData(p => ({ ...p, amount: e.target.value }))}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 font-bold outline-none transition-all"
                                    placeholder="Enter amount"
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Admin Remarks</label>
                        <textarea
                            value={processData.remarks}
                            onChange={(e) => setProcessData(p => ({ ...p, remarks: e.target.value }))}
                            rows="4"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none"
                            placeholder="Provide detailed reasoning for the decision..."
                        ></textarea>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

const StatCard = ({ label, value, icon: Icon, color }) => {
    const colors = {
        primary: 'bg-primary-50 text-primary-600',
        yellow: 'bg-yellow-50 text-yellow-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600'
    };
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className={`w-12 h-12 ${colors[color]} rounded-xl flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6" />
            </div>
            <p className="text-gray-500 text-sm font-medium">{label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
    );
};

const StatusOption = ({ label, active, onClick, icon: Icon, color }) => {
    const activeColors = {
        green: 'border-success bg-success-50 text-success',
        red: 'border-red-500 bg-red-50 text-red-600',
        purple: 'border-purple-500 bg-purple-50 text-purple-600'
    };
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${active ? activeColors[color] : 'border-gray-100 hover:border-gray-300 text-gray-500'
                }`}
        >
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
        </button>
    );
};

export default AdminClaimListPage;
