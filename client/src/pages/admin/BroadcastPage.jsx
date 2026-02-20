import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchAllNotifications,
    sendBroadcast,
    deleteNotification,
    clearNotificationStatus
} from '../../store/slices/notificationSlice';
import PageHeader from '../../components/common/PageHeader';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import { formatDate } from '../../utils/helpers';
import {
    Send,
    Search,
    Filter,
    Users,
    Bell,
    Trash2,
    CheckCircle,
    XCircle,
    Megaphone,
    User
} from 'lucide-react';
import api from '../../services/api'; // For searching customers

const BroadcastPage = () => {
    const dispatch = useDispatch();
    const {
        notifications,
        loading,
        btnLoading,
        error,
        success,
        pagination
    } = useSelector((state) => state.notification);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [customers, setCustomers] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const [formData, setFormData] = useState({
        customerID: '',
        customerName: '',
        title: '',
        message: '',
        messageType: 'General'
    });

    useEffect(() => {
        dispatch(fetchAllNotifications({ page: 1, limit: 10 }));
        return () => dispatch(clearNotificationStatus());
    }, [dispatch]);

    const handleSearchCustomers = async (e) => {
        const val = e.target.value;
        setSearchTerm(val);
        if (val.length < 3) {
            setCustomers([]);
            return;
        }

        setIsSearching(true);
        try {
            const response = await api.get(`/customers?search=${val}&limit=5`);
            setCustomers(response.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSearching(false);
        }
    };

    const selectCustomer = (cust) => {
        setFormData({ ...formData, customerID: cust._id, customerName: cust.name });
        setCustomers([]);
        setSearchTerm('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(sendBroadcast({
            customerID: formData.customerID,
            title: formData.title,
            message: formData.message,
            messageType: formData.messageType
        }));

        if (sendBroadcast.fulfilled.match(result)) {
            setIsModalOpen(false);
            setFormData({ customerID: '', customerName: '', title: '', message: '', messageType: 'General' });
            dispatch(fetchAllNotifications({ page: 1, limit: 10 }));
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Delete this notification log?')) {
            dispatch(deleteNotification(id));
        }
    };

    if (loading && notifications.length === 0) {
        return <Loader fullScreen text="Loading notification logs..." />;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <PageHeader
                title="Broadcast & Logs"
                subtitle="Manage system-wide notifications and send manual alerts"
            >
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-xl font-bold shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all hover:translate-y-[-1px] active:translate-y-0"
                >
                    <Send className="w-4 h-4" />
                    New Broadcast
                </button>
            </PageHeader>

            {error && <Alert type="error" message={error} onClose={() => dispatch(clearNotificationStatus())} className="mb-6" />}
            {success && <Alert type="success" message={success} onClose={() => dispatch(clearNotificationStatus())} className="mb-6" />}

            {/* Logs Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-border-light overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border-light">
                        <thead className="bg-bg-secondary">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-text-tertiary uppercase tracking-wider">Date & ID</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-text-tertiary uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-text-tertiary uppercase tracking-wider">Message Content</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-text-tertiary uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-text-tertiary uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-text-tertiary uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-border-light">
                            {notifications.map((log) => (
                                <tr key={log._id} className="hover:bg-bg-secondary/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-bold text-primary-600">{log.notificationID}</div>
                                        <div className="text-xs text-text-tertiary mt-1">{formatDate(log.sentDate)}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-bold text-text-primary">{log.customerID?.name}</div>
                                        <div className="text-xs text-text-tertiary font-medium">{log.customerID?.customerID}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="max-w-xs">
                                            <div className="text-sm font-semibold text-text-primary truncate">{log.title}</div>
                                            <div className="text-xs text-text-secondary truncate">{log.message}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-2 py-1 bg-bg-secondary border border-border-light rounded-lg text-xs font-bold text-text-secondary">
                                            {log.messageType}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-success">
                                            <div className="w-1.5 h-1.5 rounded-full bg-success"></div>
                                            {log.deliveryStatus}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <button
                                            onClick={() => handleDelete(log._id)}
                                            className="p-2 text-text-tertiary hover:text-danger hover:bg-danger-light rounded-lg transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Broadcast Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Send Manual Notification"
                size="lg"
                footer={
                    <div className="flex items-center justify-end gap-3 w-full">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-6 py-2.5 border border-border-light rounded-xl font-bold text-text-secondary hover:bg-bg-secondary transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={btnLoading || !formData.customerID || !formData.title || !formData.message}
                            className="px-8 py-2.5 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 disabled:bg-gray-300 transition-all flex items-center gap-2"
                        >
                            {btnLoading ? 'Sending...' : (
                                <>
                                    <Send className="w-4 h-4" />
                                    Send Notification
                                </>
                            )}
                        </button>
                    </div>
                }
            >
                <div className="space-y-6">
                    {/* Customer Selection */}
                    <div className="relative">
                        <label className="block text-sm font-bold text-text-secondary mb-2">Recipient Customer</label>
                        {formData.customerID ? (
                            <div className="flex items-center justify-between p-3 bg-primary-50 border border-primary-200 rounded-xl">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-primary-600" />
                                    <span className="text-sm font-bold text-primary-700">{formData.customerName}</span>
                                </div>
                                <button
                                    onClick={() => setFormData({ ...formData, customerID: '', customerName: '' })}
                                    className="text-xs font-bold text-primary-600 hover:underline"
                                >
                                    Change
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={handleSearchCustomers}
                                        placeholder="Search by name or ID (min 3 chars)..."
                                        className="w-full pl-10 pr-4 py-3 border border-border-light rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                    />
                                </div>
                                {isSearching && <div className="mt-2 text-xs text-text-tertiary italic">Searching...</div>}
                                {customers.length > 0 && (
                                    <div className="absolute z-50 w-full mt-2 bg-white border border-border-light rounded-xl shadow-xl overflow-hidden divide-y divide-border-light">
                                        {customers.map(cust => (
                                            <button
                                                key={cust._id}
                                                onClick={() => selectCustomer(cust)}
                                                className="w-full text-left px-4 py-3 hover:bg-primary-50 flex items-center gap-3 transition-colors"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-xs uppercase">
                                                    {cust.name.substring(0, 2)}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-text-primary">{cust.name}</div>
                                                    <div className="text-xs text-text-tertiary">{cust.customerID}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-sm font-bold text-text-secondary mb-2">Notification Type</label>
                            <select
                                value={formData.messageType}
                                onChange={(e) => setFormData({ ...formData, messageType: e.target.value })}
                                className="w-full px-4 py-3 border border-border-light rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                            >
                                <option value="General">General Announcement</option>
                                <option value="Payment">Payment Related</option>
                                <option value="Claim-Update">Claim Status Update</option>
                                <option value="Renewal">Renewal Opportunity</option>
                                <option value="Expiry">Expiry Warning</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-text-secondary mb-2">Subject Title</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g. Schedule Maintenance Reminder"
                            className="w-full px-4 py-3 border border-border-light rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-text-secondary mb-2">Detailed Message</label>
                        <textarea
                            required
                            rows="5"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            placeholder="Write your message here..."
                            className="w-full px-4 py-3 border border-border-light rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none"
                        ></textarea>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default BroadcastPage;
