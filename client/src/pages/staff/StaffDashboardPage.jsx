import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats, clearDashboardError } from '../../store/slices/dashboardSlice';
import { Users, ShieldCheck, IndianRupee, ClipboardList } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import { formatCurrency } from '../../utils/helpers';

const StaffDashboardPage = () => {
    const dispatch = useDispatch();
    const { stats, loading, error } = useSelector((state) => state.dashboard);

    useEffect(() => {
        dispatch(fetchDashboardStats());
        return () => dispatch(clearDashboardError());
    }, [dispatch]);

    if (loading && !stats) {
        return <Loader fullScreen text="Loading dashboard..." />;
    }

    const cards = [
        {
            title: 'Total Customers',
            value: stats?.customers || 0,
            icon: Users,
            bg: 'bg-indigo-50',
            text: 'text-indigo-600'
        },
        {
            title: 'Active Policies',
            value: stats?.activePolicies || 0,
            icon: ShieldCheck,
            bg: 'bg-emerald-50',
            text: 'text-emerald-600'
        },
        {
            title: 'Revenue Overview',
            value: formatCurrency(stats?.premiumCollected || 0),
            icon: IndianRupee,
            bg: 'bg-amber-50',
            text: 'text-amber-600'
        },
        {
            title: 'System Tasks',
            value: 'Healthy',
            icon: ClipboardList,
            bg: 'bg-sky-50',
            text: 'text-sky-600'
        }
    ];

    return (
        <div className="space-y-8">
            <PageHeader
                title="Staff Workspace"
                subtitle="Operations overview and management dashboard"
            />

            {error && <Alert type="error" message={error} onClose={() => dispatch(clearDashboardError())} />}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, idx) => (
                    <div key={idx} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                        <div className={`w-12 h-12 rounded-2xl ${card.bg} ${card.text} flex items-center justify-center mb-4`}>
                            <card.icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium">{card.title}</h3>
                        <p className="text-2xl font-black text-gray-900 mt-1">{card.value}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                <div className="max-w-2xl">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Operations Center</h3>
                    <p className="text-gray-600 leading-relaxed">
                        Welcome to the Staff Dashboard. From here you can manage customer registrations,
                        vehicle approvals, and assist with policy renewals and claims processing.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-4">
                        <div className="px-4 py-2 bg-gray-50 rounded-xl text-sm font-bold text-gray-700">RBAC: STAFF_ACCESS</div>
                        <div className="px-4 py-2 bg-gray-50 rounded-xl text-sm font-bold text-gray-700">STATUS: ACTIVE</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffDashboardPage;