import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    FileText,
    Car,
    AlertTriangle,
    CreditCard,
    RefreshCw,
    Plus,
    ArrowRight,
    Bell,
    ChevronRight,
} from 'lucide-react';
import { selectAuth } from '../../store/slices/authSlice';
import {
    fetchCustomerDashboard,
    selectCustomers,
} from '../../store/slices/customerSlice';
import {
    PageHeader,
    StatsCard,
    EmptyState,
    Button,
    Badge,
    Spinner,
} from '../../components/common';
import { formatCurrency, formatDate } from '../../utils/helpers';

const CustomerDashboardPage = () => {
    const dispatch = useDispatch();
    const { customer } = useSelector(selectAuth);
    const { dashboard, isDashboardLoading } = useSelector(selectCustomers);

    useEffect(() => {
        if (customer?._id) {
            dispatch(fetchCustomerDashboard(customer._id));
        }
    }, [dispatch, customer?._id]);

    const summary = dashboard?.summary;

    if (isDashboardLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Spinner size="lg" />
            </div>
        );
    }

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard
                    title="Active Policies"
                    value={summary?.policies?.active || 0}
                    icon={FileText}
                    iconBgClass="bg-primary-50"
                    iconClass="text-primary-500"
                />
                <StatsCard
                    title="My Vehicles"
                    value={summary?.vehicles?.total || 0}
                    icon={Car}
                    iconBgClass="bg-info-light"
                    iconClass="text-info"
                />
                <StatsCard
                    title="Pending Claims"
                    value={summary?.claims?.pending || 0}
                    icon={AlertTriangle}
                    iconBgClass="bg-warning-light"
                    iconClass="text-warning"
                />
                <StatsCard
                    title="Total Paid"
                    value={formatCurrency(summary?.payments?.totalPaid || 0)}
                    icon={CreditCard}
                    iconBgClass="bg-success-light"
                    iconClass="text-success"
                />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* My Vehicles */}
                <div className="bg-white rounded-xl shadow-sm border border-border-light p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-text-primary">
                            My Vehicles
                        </h3>
                        <Link
                            to="/vehicles"
                            className="text-sm text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1"
                        >
                            View All <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {summary?.vehicles?.list?.length > 0 ? (
                        <div className="space-y-3">
                            {summary.vehicles.list.map((vehicle) => (
                                <div
                                    key={vehicle._id}
                                    className="flex items-center justify-between p-3 bg-bg-primary rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-info-light rounded-lg flex items-center justify-center">
                                            <Car className="w-5 h-5 text-info" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-text-primary">
                                                {vehicle.vehicleNumber}
                                            </p>
                                            <p className="text-xs text-text-secondary">
                                                {vehicle.model} • {vehicle.vehicleType}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge>{vehicle.vehicleType}</Badge>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={Car}
                            title="No vehicles registered"
                            description="Add your first vehicle to get started"
                        >
                            <Link to="/vehicles/add">
                                <Button size="sm">Add Vehicle</Button>
                            </Link>
                        </EmptyState>
                    )}
                </div>

                {/* Active Policies */}
                <div className="bg-white rounded-xl shadow-sm border border-border-light p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-text-primary">
                            Active Policies
                        </h3>
                        <Link
                            to="/premiums"
                            className="text-sm text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1"
                        >
                            View All <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {summary?.policies?.recentActive?.length > 0 ? (
                        <div className="space-y-3">
                            {summary.policies.recentActive.map((policy) => (
                                <div
                                    key={policy._id}
                                    className="flex items-center justify-between p-3 bg-bg-primary rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                                            <FileText className="w-5 h-5 text-primary-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-text-primary">
                                                {policy.policyID?.policyName || 'Policy'}
                                            </p>
                                            <p className="text-xs text-text-secondary">
                                                {policy.vehicleID?.vehicleNumber} •{' '}
                                                {formatCurrency(policy.calculatedAmount)}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge status="Paid">Paid</Badge>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={FileText}
                            title="No active policies"
                            description="Purchase a policy to protect your vehicle"
                        >
                            <Link to="/policies">
                                <Button size="sm">Browse Policies</Button>
                            </Link>
                        </EmptyState>
                    )}
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Claims Summary */}
                <div className="bg-white rounded-xl shadow-sm border border-border-light p-6">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">
                        Claims Summary
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-text-secondary">Total Claims</span>
                            <span className="text-sm font-semibold text-text-primary">
                                {summary?.claims?.total || 0}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-text-secondary">Pending</span>
                            <Badge status="Pending">{summary?.claims?.pending || 0}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-text-secondary">Approved</span>
                            <Badge status="Approved">{summary?.claims?.approved || 0}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-text-secondary">Rejected</span>
                            <Badge status="Rejected">{summary?.claims?.rejected || 0}</Badge>
                        </div>
                        <div className="pt-3 border-t border-border-light flex items-center justify-between">
                            <span className="text-sm font-medium text-text-primary">
                                Approved Amount
                            </span>
                            <span className="text-sm font-bold text-success">
                                {formatCurrency(summary?.claims?.totalApprovedAmount || 0)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Renewals */}
                <div className="bg-white rounded-xl shadow-sm border border-border-light p-6">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">
                        Renewals
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-warning-light rounded-lg flex items-center justify-center">
                                <RefreshCw className="w-6 h-6 text-warning" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-text-primary">
                                    {summary?.renewals?.pending || 0}
                                </p>
                                <p className="text-xs text-text-secondary">Pending Renewals</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-danger-light rounded-lg flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-danger" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-text-primary">
                                    {summary?.renewals?.expired || 0}
                                </p>
                                <p className="text-xs text-text-secondary">Expired</p>
                            </div>
                        </div>
                    </div>
                    <Link to="/renewals" className="block mt-4">
                        <Button variant="outline" fullWidth size="sm">
                            Manage Renewals
                        </Button>
                    </Link>
                </div>

                {/* Recent Notifications */}
                <div className="bg-white rounded-xl shadow-sm border border-border-light p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-text-primary">
                            Notifications
                        </h3>
                        {(summary?.notifications?.unreadCount || 0) > 0 && (
                            <span className="bg-danger text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                {summary.notifications.unreadCount}
                            </span>
                        )}
                    </div>

                    {summary?.notifications?.recent?.length > 0 ? (
                        <div className="space-y-3">
                            {summary.notifications.recent.map((notif) => (
                                <div
                                    key={notif._id}
                                    className={`p-3 rounded-lg ${notif.isRead ? 'bg-bg-primary' : 'bg-primary-50'
                                        }`}
                                >
                                    <div className="flex items-start gap-2">
                                        {!notif.isRead && (
                                            <div className="w-2 h-2 bg-primary-500 rounded-full mt-1.5 flex-shrink-0" />
                                        )}
                                        <div>
                                            <p className="text-sm font-medium text-text-primary">
                                                {notif.title}
                                            </p>
                                            <p className="text-xs text-text-tertiary mt-0.5">
                                                {formatDate(notif.sentDate)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-6">
                            <Bell className="w-8 h-8 text-text-tertiary mx-auto mb-2" />
                            <p className="text-sm text-text-secondary">No notifications</p>
                        </div>
                    )}

                    <Link to="/notifications" className="block mt-4">
                        <Button variant="ghost" fullWidth size="sm">
                            View All Notifications
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboardPage;