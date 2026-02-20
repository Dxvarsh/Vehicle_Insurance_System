import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchAllRenewals,
    approveRenewal,
    rejectRenewal,
    sendRenewalReminder,
    clearInsuranceStatus
} from '../../store/slices/insuranceSlice';
import PageHeader from '../../components/common/PageHeader';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import { formatDate, formatCurrency } from '../../utils/helpers';

const AdminRenewalListPage = () => {
    const dispatch = useDispatch();
    const { renewals, loading, btnLoading, error, success, pagination } = useSelector(
        (state) => state.insurance
    );

    const [selectedRenewal, setSelectedRenewal] = useState(null);
    const [actionType, setActionType] = useState(null); // 'approve' or 'reject'
    const [remarks, setRemarks] = useState('');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        dispatch(fetchAllRenewals({ page: 1, limit: 10 }));
        return () => dispatch(clearInsuranceStatus());
    }, [dispatch]);

    const handleActionClick = (renewal, type) => {
        setSelectedRenewal(renewal);
        setActionType(type);
        setRemarks('');
        setShowModal(true);
    };

    const handleConfirmAction = async () => {
        if (actionType === 'approve') {
            await dispatch(approveRenewal({ id: selectedRenewal._id, adminRemarks: remarks }));
        } else {
            await dispatch(rejectRenewal({ id: selectedRenewal._id, adminRemarks: remarks }));
        }
        setShowModal(false);
        dispatch(fetchAllRenewals({ page: pagination.page, limit: pagination.limit }));
    };

    const handleSendReminder = (id) => {
        dispatch(sendRenewalReminder(id));
    };

    if (loading && renewals.length === 0) {
        return <Loader fullScreen text="Loading renewal requests..." />;
    }

    return (
        <div>
            <PageHeader
                title="Manage Renewals"
                subtitle="Review and process policy renewal requests from customers"
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
                    title="No renewals found"
                    description="There are no renewal requests to display."
                />
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Policy & Vehicle
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Renewal Info
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {renewals.map((renewal) => (
                                    <tr key={renewal._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-gray-900">
                                                {renewal.customerID?.name}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                ID: {renewal.customerID?.customerID}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {renewal.policyID?.policyName}
                                            </div>
                                            <div className="text-xs text-primary-600 font-medium">
                                                {renewal.vehicleID?.vehicleNumber} ({renewal.vehicleID?.model})
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-xs text-gray-500">
                                                Requested: {formatDate(renewal.renewalDate)}
                                            </div>
                                            <div className="text-xs text-red-500 font-medium mt-1">
                                                Expiry: {formatDate(renewal.expiryDate)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge status={renewal.renewalStatus} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            {renewal.renewalStatus === 'Pending' && (
                                                <>
                                                    <button
                                                        disabled={btnLoading}
                                                        onClick={() => handleActionClick(renewal, 'approve')}
                                                        className="text-green-600 hover:text-green-900 bg-green-50 px-3 py-1.5 rounded-md transition-colors"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        disabled={btnLoading}
                                                        onClick={() => handleActionClick(renewal, 'reject')}
                                                        className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1.5 rounded-md transition-colors"
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                            {renewal.renewalStatus === 'Approved' && !renewal.reminderSentStatus && (
                                                <button
                                                    disabled={btnLoading}
                                                    onClick={() => handleSendReminder(renewal._id)}
                                                    className="text-primary-600 hover:text-primary-900 bg-primary-50 px-3 py-1.5 rounded-md transition-colors"
                                                >
                                                    Send Reminder
                                                </button>
                                            )}
                                            {renewal.reminderSentStatus && (
                                                <span className="text-xs text-gray-400 italic">
                                                    Reminder Sent ({formatDate(renewal.reminderSentDate)})
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Action Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={actionType === 'approve' ? 'Approve Renewal' : 'Reject Renewal'}
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Are you sure you want to {actionType} the renewal request for{' '}
                        <span className="font-bold">{selectedRenewal?.customerID?.name}</span>?
                    </p>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Admin Remarks
                        </label>
                        <textarea
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 text-sm"
                            rows="3"
                            placeholder="Add internal notes or reasons for rejection..."
                        ></textarea>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            onClick={() => setShowModal(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirmAction}
                            disabled={btnLoading}
                            className={`px-4 py-2 text-sm font-medium text-white rounded-md ${actionType === 'approve'
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-red-600 hover:bg-red-700'
                                }`}
                        >
                            {btnLoading ? 'Processing...' : 'Confirm'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AdminRenewalListPage;
