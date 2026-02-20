import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReportData, clearDashboardError } from '../../store/slices/dashboardSlice';
import PageHeader from '../../components/common/PageHeader';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import Badge from '../../components/common/Badge';
import { formatDate, formatCurrency } from '../../utils/helpers';
import {
    FileText,
    Download,
    Filter,
    Search,
    Shield,
    CreditCard,
    AlertTriangle,
    Calendar,
    ChevronDown,
    ExternalLink
} from 'lucide-react';
import { cn } from '../../utils/helpers';

const AdminReportsPage = () => {
    const dispatch = useDispatch();
    const { reports, loading, error } = useSelector((state) => state.dashboard);
    const [reportType, setReportType] = useState('policies'); // 'policies', 'premiums', 'claims'

    useEffect(() => {
        dispatch(fetchReportData(reportType));
        return () => dispatch(clearDashboardError());
    }, [dispatch, reportType]);

    const handleDownload = () => {
        // Mock download functionality
        const data = reports[reportType];
        const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(data))}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = `${reportType}_report_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    };

    const renderTable = () => {
        const data = Array.isArray(reports[reportType]) ? reports[reportType] : [];

        if (reportType === 'policies') {
            return (
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Policy Detail</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Vehicle</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Expiry</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {data.map((item) => (
                            <tr key={item._id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-bold text-gray-900">{item.policyID?.policyName}</div>
                                    <div className="text-xs text-primary-600 font-medium">{item.policyID?.policyID}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-semibold text-gray-900">{item.customerID?.name}</div>
                                    <div className="text-xs text-gray-400">{item.customerID?.customerID}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-700">{item.vehicleID?.vehicleNumber}</div>
                                    <div className="text-xs text-gray-400">{item.vehicleID?.model}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                                    {formatDate(item.expiryDate)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Badge status={item.renewalStatus} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        }

        if (reportType === 'premiums') {
            return (
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Transaction ID</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Payment Date</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Policy</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {data.map((item) => (
                            <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-bold text-gray-900 font-mono">{item.transactionID}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">
                                    {item.customerID?.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-emerald-600">
                                    {formatCurrency(item.calculatedAmount)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(item.paymentDate)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {item.policyID?.policyName}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        }

        if (reportType === 'claims') {
            return (
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Claim ID</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Submission Date</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {data.map((item) => (
                            <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-bold text-primary-600">{item.claimID}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">
                                    {item.customerID?.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-rose-600">
                                    {item.claimAmount ? formatCurrency(item.claimAmount) : 'Pending'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(item.claimDate)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Badge status={item.claimStatus} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Operational Reports"
                subtitle="Generate and audit system data exports"
            >
                <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-2xl font-bold shadow-lg shadow-gray-200 hover:bg-black transition-all"
                >
                    <Download className="w-4 h-4" />
                    Export JSON
                </button>
            </PageHeader>

            {error && <Alert type="error" message={error} onClose={() => dispatch(clearDashboardError())} />}

            {/* Tab Navigation */}
            <div className="flex p-1.5 bg-gray-100 rounded-2xl w-fit">
                {[
                    { id: 'policies', label: 'Active Policies', icon: Shield },
                    { id: 'premiums', label: 'Premium Collections', icon: CreditCard },
                    { id: 'claims', label: 'Claim Records', icon: AlertTriangle },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setReportType(tab.id)}
                        className={cn(
                            "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                            reportType === tab.id
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-20 flex flex-col items-center justify-center">
                            <Loader className="w-8 h-8 text-primary-500 animate-spin mb-4" />
                            <p className="text-gray-500 font-medium">Generating report data...</p>
                        </div>
                    ) : (
                        renderTable()
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminReportsPage;
