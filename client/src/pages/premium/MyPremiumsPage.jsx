import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
    fetchMyPremiums,
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
import { CreditCard, Eye, Download, Shield, Car } from 'lucide-react';
import moment from 'moment';

const MyPremiumsPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        myPremiums,
        isLoading,
        pagination,
        error,
    } = useSelector(selectPolicies);

    useEffect(() => {
        dispatch(fetchMyPremiums({ page: 1, limit: 10 }));
    }, [dispatch]);

    const columns = [
        {
            header: 'Policy',
            accessor: 'policyID',
            render: (premium) => (
                <div>
                    <p className="font-bold text-text-primary">{premium.policyID?.policyName}</p>
                    <Badge variant="outline" size="sm">{premium.policyID?.coverageType}</Badge>
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
            render: (premium) => moment(premium.createdAt).format('DD MMM YYYY'),
        },
        {
            header: 'Actions',
            accessor: '_id',
            render: (premium) => (
                <div className="flex gap-2">
                    {premium.paymentStatus === 'Pending' ? (
                        <Button
                            size="sm"
                            onClick={() => navigate(`/premium/pay/${premium._id}`)}
                            leftIcon={<CreditCard className="w-4 h-4" />}
                        >
                            Pay Now
                        </Button>
                    ) : (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/premium/receipt/${premium._id}`)}
                            leftIcon={<Download className="w-4 h-4" />}
                        >
                            Receipt
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    if (isLoading && myPremiums.length === 0) {
        return (
            <div className="h-96 flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <PageHeader
                title="My Premiums"
                description="View your payment history and pending dues"
                icon={CreditCard}
                actions={
                    <Link to="/policies">
                        <Button>Buy New Policy</Button>
                    </Link>
                }
            />

            {myPremiums.length > 0 ? (
                <DataTable
                    columns={columns}
                    data={myPremiums}
                    pagination={pagination}
                    onPageChange={(page) => dispatch(fetchMyPremiums({ page, limit: 10 }))}
                />
            ) : (
                <EmptyState
                    title="No Premiums Found"
                    description="You haven't purchased any policies yet."
                    icon={CreditCard}
                    action={
                        <Link to="/policies">
                            <Button>Browse Policies</Button>
                        </Link>
                    }
                />
            )}
        </div>
    );
};

export default MyPremiumsPage;
