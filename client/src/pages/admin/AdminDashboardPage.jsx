import {
    Users,
    FileText,
    AlertTriangle,
    CreditCard,
    Car,
    RefreshCw,
    TrendingUp,
} from 'lucide-react';
import { PageHeader, StatsCard } from '../../components/common';

const AdminDashboardPage = () => {
    return (
        <div>
            <PageHeader
                title="Admin Dashboard"
                subtitle="System overview and key metrics"
            />

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatsCard
                    title="Total Customers"
                    value="0"
                    icon={Users}
                    iconBgClass="bg-primary-50"
                    iconClass="text-primary-500"
                    trend={{ value: 0, type: 'neutral', label: 'this month' }}
                />
                <StatsCard
                    title="Active Policies"
                    value="0"
                    icon={FileText}
                    iconBgClass="bg-success-light"
                    iconClass="text-success"
                    trend={{ value: 0, type: 'neutral', label: 'this month' }}
                />
                <StatsCard
                    title="Pending Claims"
                    value="0"
                    icon={AlertTriangle}
                    iconBgClass="bg-warning-light"
                    iconClass="text-warning"
                />
                <StatsCard
                    title="Monthly Revenue"
                    value="₹0"
                    icon={TrendingUp}
                    iconBgClass="bg-info-light"
                    iconClass="text-info"
                    trend={{ value: 0, type: 'neutral', label: 'vs last month' }}
                />
            </div>

            {/* Placeholder sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-border-light p-6 h-80 flex items-center justify-center">
                    <p className="text-text-tertiary">📊 Charts coming in Iteration 6</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-border-light p-6 h-80 flex items-center justify-center">
                    <p className="text-text-tertiary">📋 Recent Activity coming in Iteration 6</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;