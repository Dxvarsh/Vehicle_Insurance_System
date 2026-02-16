import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    fetchAdminPremiums,
    selectPolicies,
} from '../../store/slices/policySlice';
import {
    PageHeader,
    Button,
    Spinner,
    Badge,
    DataTable,
    EmptyState,
} from '../../components/common';
import { Calculator, Eye, Download, Search } from 'lucide-react';
import moment from 'moment';

const AdminPremiumListPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { adminPremiums, isLoading, pagination } = useSelector(selectPolicies);

    useEffect(() => {
        dispatch(fetchAdminPremiums({ page: 1, limit: 10 }));
    }, [dispatch]);

    const columns = [
        {
            header: 'Policy',
            accessor: 'policyID',
            render: (premium) => (
                <div>
                    <p className="font-bold text-text-primary">{premium.policyID?.policyName}</p>
                    <span className="text-xs text-text-tertiary">{premium.policyID?.coverageType}</span>
                </div>
            ),
        },
        {
            header: 'Customer',
            accessor: 'customerID',
            render: (premium) => (
                <div>
                    <p className="font-medium text-text-primary">{premium.customerID?.name}</p>
                    <p className="text-xs text-text-secondary">{premium.customerID?.email}</p>
                </div>
            ),
        },
        {
            header: 'Vehicle',
            accessor: 'vehicleID',
            render: (premium) => (
                <div>
                    <p className="font-medium text-text-primary">{premium.vehicleID?.vehicleNumber}</p>
                    <p className="text-xs text-text-secondary">{premium.vehicleID?.model}</p>
                </div>
            ),
        },
        {
            header: 'Amount',
            accessor: 'calculatedAmount',
            render: (premium) => (
                <span className="font-mono font-bold text-primary-600">
                    ₹{premium.calculatedAmount?.toLocaleString()}
                </span>
            ),
        },
        {
            header: 'Status',
            accessor: 'paymentStatus',
            render: (premium) => (
                <Badge
                    variant={
                        premium.paymentStatus === 'Paid' ? 'success' : premium.paymentStatus === 'Pending' ? 'warning' : 'danger'
                    }
                >
                    {premium.paymentStatus}
                </Badge>
            ),
        },
        {
            header: 'Date',
            accessor: 'createdAt',
            render: (premium) => moment(premium.createdAt).format('DD MMM YYYY, HH:mm'),
        },
    ];

    if (isLoading && adminPremiums.length === 0) {
        return (
            <div className="h-96 flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <PageHeader
                title="Premium Transactions"
                description="Manage and view all customer payments"
                icon={Calculator}
            />

            {adminPremiums.length > 0 ? (
                <DataTable
                    columns={columns}
                    data={adminPremiums}
                    pagination={pagination}
                    onPageChange={(page) => dispatch(fetchAdminPremiums({ page, limit: 10 }))}
                />
            ) : (
                <EmptyState
                    title="No Transactions Found"
                    description="There are no premium records yet."
                    icon={Calculator}
                />
            )}
        </div>
    );
};

export default AdminPremiumListPage;
