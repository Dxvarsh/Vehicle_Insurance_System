import { Users, FileText, Car, ClipboardList } from 'lucide-react';
import { PageHeader, StatsCard } from '../../components/common';

const StaffDashboardPage = () => {
    return (
        <div>
            <PageHeader
                title="Staff Dashboard"
                subtitle="Manage customers, vehicles, and policies"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatsCard
                    title="Customers Managed"
                    value="0"
                    icon={Users}
                    iconBgClass="bg-primary-50"
                    iconClass="text-primary-500"
                />
                <StatsCard
                    title="Vehicles Registered"
                    value="0"
                    icon={Car}
                    iconBgClass="bg-info-light"
                    iconClass="text-info"
                />
                <StatsCard
                    title="Policies Assisted"
                    value="0"
                    icon={FileText}
                    iconBgClass="bg-success-light"
                    iconClass="text-success"
                />
                <StatsCard
                    title="Pending Tasks"
                    value="0"
                    icon={ClipboardList}
                    iconBgClass="bg-warning-light"
                    iconClass="text-warning"
                />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-border-light p-6 h-64 flex items-center justify-center">
                <p className="text-text-tertiary">🔧 Staff features coming in next iterations</p>
            </div>
        </div>
    );
};

export default StaffDashboardPage;