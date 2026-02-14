import {
    FileText,
    Car,
    AlertTriangle,
    CreditCard,
    RefreshCw,
    Plus,
    ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuth } from '../../store/slices/authSlice';
import { PageHeader, StatsCard, EmptyState, Button } from '../../components/common';

const CustomerDashboardPage = () => {
    const { customer } = useSelector(selectAuth);

    return (
        <div>
            {/* Page Header */}
            <PageHeader
                title={`Welcome back, ${customer?.name || 'User'}!`}
                subtitle="Here's your insurance overview"
            />

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <Link
                    to="/policies"
                    className="flex items-center justify-between p-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors group"
                >
                    <div className="flex items-center gap-3">
                        <Plus className="w-5 h-5" />
                        <span className="font-semibold text-sm">Purchase Policy</span>
                    </div>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                    to="/claims/new"
                    className="flex items-center justify-between p-4 bg-white hover:bg-bg-secondary border-2 border-border-light text-text-primary rounded-xl transition-colors group"
                >
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-warning" />
                        <span className="font-semibold text-sm">File a Claim</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-text-tertiary group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                    to="/vehicles/add"
                    className="flex items-center justify-between p-4 bg-white hover:bg-bg-secondary border-2 border-border-light text-text-primary rounded-xl transition-colors group"
                >
                    <div className="flex items-center gap-3">
                        <Car className="w-5 h-5 text-info" />
                        <span className="font-semibold text-sm">Add Vehicle</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-text-tertiary group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatsCard
                    title="Active Policies"
                    value="0"
                    icon={FileText}
                    iconBgClass="bg-primary-50"
                    iconClass="text-primary-500"
                />
                <StatsCard
                    title="My Vehicles"
                    value="0"
                    icon={Car}
                    iconBgClass="bg-info-light"
                    iconClass="text-info"
                />
                <StatsCard
                    title="Pending Claims"
                    value="0"
                    icon={AlertTriangle}
                    iconBgClass="bg-warning-light"
                    iconClass="text-warning"
                />
                <StatsCard
                    title="Upcoming Renewals"
                    value="0"
                    icon={RefreshCw}
                    iconBgClass="bg-success-light"
                    iconClass="text-success"
                />
            </div>

            {/* Content Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Active Policies */}
                <div className="bg-white rounded-xl shadow-sm border border-border-light p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-text-primary">
                            Active Policies
                        </h3>
                        <Link
                            to="/policies"
                            className="text-sm text-primary-500 hover:text-primary-600 font-medium"
                        >
                            View All
                        </Link>
                    </div>
                    <EmptyState
                        icon={FileText}
                        title="No active policies"
                        description="Purchase your first insurance policy to get started"
                    >
                        <Link to="/policies">
                            <Button size="sm">Browse Policies</Button>
                        </Link>
                    </EmptyState>
                </div>

                {/* Recent Notifications */}
                <div className="bg-white rounded-xl shadow-sm border border-border-light p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-text-primary">
                            Recent Notifications
                        </h3>
                        <Link
                            to="/notifications"
                            className="text-sm text-primary-500 hover:text-primary-600 font-medium"
                        >
                            View All
                        </Link>
                    </div>
                    <EmptyState
                        icon={CreditCard}
                        title="No notifications"
                        description="You're all caught up!"
                    />
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboardPage;