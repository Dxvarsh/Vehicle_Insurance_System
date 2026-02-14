import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Mail,
    Phone,
    MapPin,
    Calendar,
    Shield,
    Hash,
    User,
    Car,
    ArrowLeft,
    UserX,
    UserCheck,
} from 'lucide-react';
import {
    fetchCustomerById,
    clearSelectedCustomer,
    selectCustomers,
} from '../../store/slices/customerSlice';
import {
    PageHeader,
    Badge,
    Button,
    Spinner,
    EmptyState,
} from '../../components/common';
import { formatDate } from '../../utils/helpers';

const CustomerDetailPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { selectedCustomer, isLoading } = useSelector(selectCustomers);

    useEffect(() => {
        if (id) {
            dispatch(fetchCustomerById(id));
        }
        return () => {
            dispatch(clearSelectedCustomer());
        };
    }, [dispatch, id]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!selectedCustomer) {
        return (
            <EmptyState
                icon={User}
                title="Customer not found"
                description="The customer you're looking for doesn't exist or has been removed."
            >
                <Button onClick={() => navigate(-1)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                    Go Back
                </Button>
            </EmptyState>
        );
    }

    const { customer, userAccount } = selectedCustomer;

    const profileFields = [
        { icon: Hash, label: 'Customer ID', value: customer?.customerID },
        { icon: User, label: 'Username', value: userAccount?.username || 'N/A' },
        { icon: Mail, label: 'Email', value: customer?.email },
        { icon: Phone, label: 'Contact', value: customer?.contactNumber },
        { icon: MapPin, label: 'Address', value: customer?.address },
        { icon: Shield, label: 'Role', value: userAccount?.role || 'Customer' },
        { icon: Calendar, label: 'Joined', value: customer?.createdAt ? formatDate(customer.createdAt) : 'N/A' },
        { icon: Calendar, label: 'Last Login', value: userAccount?.lastLogin ? formatDate(userAccount.lastLogin) : 'Never' },
    ];

    return (
        <div>
            <PageHeader
                title="Customer Details"
                subtitle={`Viewing profile for ${customer?.name}`}
                breadcrumbs={[
                    { label: 'Dashboard', href: '/admin/dashboard' },
                    { label: 'Customers', href: '/admin/customers' },
                    { label: customer?.name || 'Detail' },
                ]}
            >
                <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<ArrowLeft className="w-4 h-4" />}
                    onClick={() => navigate('/admin/customers')}
                >
                    Back to List
                </Button>
            </PageHeader>

            <div className="max-w-3xl">
                <div className="bg-white rounded-xl shadow-sm border border-border-light overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary-500 to-primary-700 px-6 py-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center ring-4 ring-white/30">
                                    <span className="text-2xl font-bold text-white">
                                        {customer?.name?.charAt(0)?.toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">
                                        {customer?.name}
                                    </h2>
                                    <p className="text-primary-100 text-sm">
                                        {customer?.customerID}
                                    </p>
                                </div>
                            </div>
                            <Badge
                                className={
                                    customer?.isActive
                                        ? 'bg-white/20 text-white'
                                        : 'bg-danger/80 text-white'
                                }
                            >
                                {customer?.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-text-primary mb-4">
                            Personal Information
                        </h3>
                        <div className="space-y-1">
                            {profileFields.map((field, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-start gap-4 py-3 border-b border-border-light last:border-0"
                                >
                                    <div className="w-10 h-10 bg-bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                                        <field.icon className="w-5 h-5 text-text-tertiary" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs text-text-tertiary font-medium uppercase tracking-wide">
                                            {field.label}
                                        </p>
                                        <p className="text-sm text-text-primary font-medium mt-0.5 break-words">
                                            {field.value}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Vehicles Section */}
                    {customer?.vehicleIDs?.length > 0 && (
                        <div className="px-6 pb-6">
                            <h3 className="text-lg font-semibold text-text-primary mb-4">
                                Registered Vehicles ({customer.vehicleIDs.length})
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {customer.vehicleIDs.map((vehicle) => (
                                    <div
                                        key={vehicle._id}
                                        className="flex items-center gap-3 p-3 bg-bg-primary rounded-lg"
                                    >
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
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomerDetailPage;