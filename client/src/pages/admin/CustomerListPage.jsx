import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    Users,
    Search,
    Eye,
    UserX,
    UserCheck,
    Filter,
    UserPlus,
    X,
} from 'lucide-react';
import {
    fetchAllCustomers,
    fetchCustomerStats,
    toggleCustomerStatus,
    selectCustomers,
} from '../../store/slices/customerSlice';
import {
    PageHeader,
    StatsCard,
    Button,
    Badge,
    Modal,
    DataTable,
} from '../../components/common';
import { formatDate, cn } from '../../utils/helpers';
import toast from 'react-hot-toast';

const CustomerListPage = () => {
    const dispatch = useDispatch();
    const { customers, pagination, stats, isLoading, isStatsLoading, isUpdating } =
        useSelector(selectCustomers);

    // Query params
    const [queryParams, setQueryParams] = useState({
        page: 1,
        limit: 10,
        search: '',
        sortBy: 'createdAt',
        sortOrder: 'desc',
        isActive: '',
    });

    const [searchInput, setSearchInput] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    // Confirm modal
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        customer: null,
        action: '', // 'activate' | 'deactivate'
    });

    // Fetch customers
    const loadCustomers = useCallback(() => {
        const params = { ...queryParams };
        // Remove empty params
        Object.keys(params).forEach((key) => {
            if (params[key] === '') delete params[key];
        });
        dispatch(fetchAllCustomers(params));
    }, [dispatch, queryParams]);

    useEffect(() => {
        loadCustomers();
    }, [loadCustomers]);

    // Fetch stats
    useEffect(() => {
        dispatch(fetchCustomerStats());
    }, [dispatch]);

    // Search with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            setQueryParams((prev) => ({ ...prev, search: searchInput, page: 1 }));
        }, 500);
        return () => clearTimeout(timer);
    }, [searchInput]);

    // Page change
    const handlePageChange = (page) => {
        setQueryParams((prev) => ({ ...prev, page }));
    };

    // Sort change
    const handleSortChange = (field) => {
        setQueryParams((prev) => ({
            ...prev,
            sortBy: field,
            sortOrder:
                prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc',
            page: 1,
        }));
    };

    // Filter change
    const handleFilterChange = (key, value) => {
        setQueryParams((prev) => ({ ...prev, [key]: value, page: 1 }));
    };

    // Clear filters
    const handleClearFilters = () => {
        setSearchInput('');
        setQueryParams({
            page: 1,
            limit: 10,
            search: '',
            sortBy: 'createdAt',
            sortOrder: 'desc',
            isActive: '',
        });
    };

    // Toggle status
    const handleToggleStatus = async () => {
        const { customer, action } = confirmModal;
        const newStatus = action === 'activate';

        try {
            await dispatch(
                toggleCustomerStatus({ id: customer._id, isActive: newStatus })
            ).unwrap();
            toast.success(
                `Customer ${newStatus ? 'activated' : 'deactivated'} successfully`
            );
            setConfirmModal({ isOpen: false, customer: null, action: '' });
            dispatch(fetchCustomerStats());
        } catch (err) {
            toast.error(err || 'Failed to update status');
        }
    };

    // Table columns
    const columns = [
        {
            header: 'Customer',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-primary-600">
                            {row.name?.charAt(0)?.toUpperCase()}
                        </span>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-text-primary">{row.name}</p>
                        <p className="text-xs text-text-tertiary">{row.customerID}</p>
                    </div>
                </div>
            ),
        },
        {
            header: 'Email',
            render: (row) => (
                <span className="text-sm text-text-secondary">{row.email}</span>
            ),
        },
        {
            header: 'Contact',
            render: (row) => (
                <span className="text-sm text-text-secondary">{row.contactNumber}</span>
            ),
        },
        {
            header: 'Vehicles',
            render: (row) => (
                <span className="text-sm text-text-primary font-medium">
                    {row.vehicleIDs?.length || 0}
                </span>
            ),
            className: 'text-center',
            cellClassName: 'text-center',
        },
        {
            header: 'Status',
            render: (row) => (
                <Badge status={row.isActive ? 'Active' : 'Inactive'}>
                    {row.isActive ? 'Active' : 'Inactive'}
                </Badge>
            ),
        },
        {
            header: 'Joined',
            render: (row) => (
                <span className="text-sm text-text-secondary">
                    {formatDate(row.createdAt)}
                </span>
            ),
        },
        {
            header: 'Actions',
            className: 'text-right',
            cellClassName: 'text-right',
            render: (row) => (
                <div className="flex items-center justify-end gap-2">
                    <Link
                        to={`/admin/customers/${row._id}`}
                        className="p-2 rounded-lg hover:bg-bg-secondary text-text-secondary hover:text-primary-500 transition-colors"
                        title="View Details"
                    >
                        <Eye className="w-4 h-4" />
                    </Link>

                    {row.isActive ? (
                        <button
                            onClick={() =>
                                setConfirmModal({
                                    isOpen: true,
                                    customer: row,
                                    action: 'deactivate',
                                })
                            }
                            className="p-2 rounded-lg hover:bg-danger-light text-text-secondary hover:text-danger transition-colors"
                            title="Deactivate"
                        >
                            <UserX className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={() =>
                                setConfirmModal({
                                    isOpen: true,
                                    customer: row,
                                    action: 'activate',
                                })
                            }
                            className="p-2 rounded-lg hover:bg-success-light text-text-secondary hover:text-success transition-colors"
                            title="Activate"
                        >
                            <UserCheck className="w-4 h-4" />
                        </button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div>
            <PageHeader
                title="Customer Management"
                subtitle="View and manage all registered customers"
            >
                <Link to="/admin/customers/new">
                    <Button leftIcon={<UserPlus className="w-4 h-4" />} size="sm">
                        Register Customer
                    </Button>
                </Link>
            </PageHeader>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatsCard
                    title="Total Customers"
                    value={stats?.total || 0}
                    icon={Users}
                    iconBgClass="bg-primary-50"
                    iconClass="text-primary-500"
                />
                <StatsCard
                    title="Active"
                    value={stats?.active || 0}
                    icon={UserCheck}
                    iconBgClass="bg-success-light"
                    iconClass="text-success"
                />
                <StatsCard
                    title="Inactive"
                    value={stats?.inactive || 0}
                    icon={UserX}
                    iconBgClass="bg-danger-light"
                    iconClass="text-danger"
                />
                <StatsCard
                    title="This Month"
                    value={stats?.thisMonth || 0}
                    icon={UserPlus}
                    iconBgClass="bg-info-light"
                    iconClass="text-info"
                    trend={
                        stats?.growthPercentage !== undefined
                            ? {
                                value: Math.abs(stats.growthPercentage),
                                type: stats.growthPercentage >= 0 ? 'up' : 'down',
                                label: 'vs last month',
                            }
                            : undefined
                    }
                />
            </div>

            {/* Search & Filters Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-border-light p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                        <input
                            type="text"
                            placeholder="Search by name, email, phone, or ID..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className={cn(
                                'w-full pl-10 pr-4 py-2.5 rounded-lg border border-border-light bg-bg-primary',
                                'text-sm text-text-primary placeholder-text-tertiary',
                                'focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500',
                                'transition-all duration-200'
                            )}
                        />
                        {searchInput && (
                            <button
                                onClick={() => setSearchInput('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Filter Toggle */}
                    <Button
                        variant={showFilters ? 'secondary' : 'outline'}
                        size="sm"
                        leftIcon={<Filter className="w-4 h-4" />}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        Filters
                    </Button>
                </div>

                {/* Filter Options */}
                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-border-light flex flex-wrap gap-3 items-center">
                        {/* Status Filter */}
                        <select
                            value={queryParams.isActive}
                            onChange={(e) => handleFilterChange('isActive', e.target.value)}
                            className="px-3 py-2 rounded-lg border border-border-light text-sm text-text-primary bg-white focus:outline-none focus:ring-2 focus:ring-primary-100"
                        >
                            <option value="">All Status</option>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>

                        {/* Sort By */}
                        <select
                            value={queryParams.sortBy}
                            onChange={(e) => handleSortChange(e.target.value)}
                            className="px-3 py-2 rounded-lg border border-border-light text-sm text-text-primary bg-white focus:outline-none focus:ring-2 focus:ring-primary-100"
                        >
                            <option value="createdAt">Sort: Newest</option>
                            <option value="name">Sort: Name</option>
                            <option value="email">Sort: Email</option>
                            <option value="customerID">Sort: ID</option>
                        </select>

                        {/* Rows per page */}
                        <select
                            value={queryParams.limit}
                            onChange={(e) =>
                                handleFilterChange('limit', parseInt(e.target.value, 10))
                            }
                            className="px-3 py-2 rounded-lg border border-border-light text-sm text-text-primary bg-white focus:outline-none focus:ring-2 focus:ring-primary-100"
                        >
                            <option value={5}>5 per page</option>
                            <option value={10}>10 per page</option>
                            <option value={25}>25 per page</option>
                            <option value={50}>50 per page</option>
                        </select>

                        {/* Clear */}
                        <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                            Clear All
                        </Button>
                    </div>
                )}
            </div>

            {/* Data Table */}
            <DataTable
                columns={columns}
                data={customers}
                pagination={pagination}
                onPageChange={handlePageChange}
                isLoading={isLoading}
                emptyMessage="No customers found"
                emptyIcon={Users}
            />

            {/* Confirm Status Toggle Modal */}
            <Modal
                isOpen={confirmModal.isOpen}
                onClose={() =>
                    setConfirmModal({ isOpen: false, customer: null, action: '' })
                }
                title={`${confirmModal.action === 'activate' ? 'Activate' : 'Deactivate'} Customer`}
                size="sm"
                footer={
                    <>
                        <Button
                            variant="outline"
                            onClick={() =>
                                setConfirmModal({ isOpen: false, customer: null, action: '' })
                            }
                        >
                            Cancel
                        </Button>
                        <Button
                            variant={confirmModal.action === 'activate' ? 'primary' : 'danger'}
                            onClick={handleToggleStatus}
                            isLoading={isUpdating}
                        >
                            {confirmModal.action === 'activate' ? 'Activate' : 'Deactivate'}
                        </Button>
                    </>
                }
            >
                <p className="text-text-secondary">
                    Are you sure you want to{' '}
                    <span className="font-semibold text-text-primary">
                        {confirmModal.action}
                    </span>{' '}
                    the account for{' '}
                    <span className="font-semibold text-text-primary">
                        {confirmModal.customer?.name}
                    </span>
                    ?
                </p>
                {confirmModal.action === 'deactivate' && (
                    <p className="text-sm text-warning-dark bg-warning-light p-3 rounded-lg mt-3">
                        ⚠️ This will prevent the customer from logging in and accessing their
                        account.
                    </p>
                )}
            </Modal>
        </div>
    );
};

export default CustomerListPage;