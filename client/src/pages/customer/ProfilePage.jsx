import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import {
    Mail,
    Phone,
    MapPin,
    Calendar,
    Shield,
    Edit3,
    X,
    Save,
    User,
    Hash,
} from 'lucide-react';
import { selectAuth } from '../../store/slices/authSlice';
import { updateCustomer, selectCustomers } from '../../store/slices/customerSlice';
import { getCurrentUser } from '../../store/slices/authSlice';
import {
    PageHeader,
    Button,
    Input,
    Alert,
    Badge,
} from '../../components/common';
import { formatDate } from '../../utils/helpers';
import { PATTERNS, MESSAGES } from '../../utils/constants';
import toast from 'react-hot-toast';

const ProfilePage = () => {
    const dispatch = useDispatch();
    const { user, customer } = useSelector(selectAuth);
    const { isUpdating, error } = useSelector(selectCustomers);
    const [isEditing, setIsEditing] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm({
        defaultValues: {
            name: customer?.name || '',
            contactNumber: customer?.contactNumber || '',
            email: customer?.email || '',
            address: customer?.address || '',
        },
    });

    // Reset form when customer data changes
    useEffect(() => {
        if (customer) {
            reset({
                name: customer.name || '',
                contactNumber: customer.contactNumber || '',
                email: customer.email || '',
                address: customer.address || '',
            });
        }
    }, [customer, reset]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        reset({
            name: customer?.name || '',
            contactNumber: customer?.contactNumber || '',
            email: customer?.email || '',
            address: customer?.address || '',
        });
    };

    const onSubmit = async (data) => {
        // Only send changed fields
        const changedFields = {};
        if (data.name !== customer.name) changedFields.name = data.name;
        if (data.contactNumber !== customer.contactNumber)
            changedFields.contactNumber = data.contactNumber;
        if (data.email !== customer.email) changedFields.email = data.email;
        if (data.address !== customer.address) changedFields.address = data.address;

        if (Object.keys(changedFields).length === 0) {
            toast.error('No changes detected');
            return;
        }

        try {
            await dispatch(
                updateCustomer({ id: customer._id, data: changedFields })
            ).unwrap();
            toast.success('Profile updated successfully');
            setIsEditing(false);
            // Refresh user data
            dispatch(getCurrentUser());
        } catch (err) {
            toast.error(err || 'Failed to update profile');
        }
    };

    const profileFields = [
        { icon: Hash, label: 'Customer ID', value: customer?.customerID },
        { icon: User, label: 'Username', value: user?.username },
        { icon: Mail, label: 'Email', value: customer?.email || user?.email },
        { icon: Phone, label: 'Contact Number', value: customer?.contactNumber || 'N/A' },
        { icon: MapPin, label: 'Address', value: customer?.address || 'N/A' },
        { icon: Shield, label: 'Role', value: user?.role },
        { icon: Calendar, label: 'Member Since', value: user?.createdAt ? formatDate(user.createdAt) : 'N/A' },
        { icon: Calendar, label: 'Last Login', value: user?.lastLogin ? formatDate(user.lastLogin) : 'N/A' },
    ];

    return (
        <div>
            <PageHeader
                title="My Profile"
                subtitle="View and manage your account information"
                breadcrumbs={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Profile' },
                ]}
            >
                {!isEditing && user?.role === 'Customer' && (
                    <Button
                        variant="primary"
                        size="sm"
                        leftIcon={<Edit3 className="w-4 h-4" />}
                        onClick={handleEdit}
                    >
                        Edit Profile
                    </Button>
                )}
            </PageHeader>

            <div className="max-w-3xl">
                {/* Error Alert */}
                {error && (
                    <Alert type="error" message={error} className="mb-6" />
                )}

                {/* Profile Card */}
                <div className="bg-white rounded-xl shadow-sm border border-border-light overflow-hidden">
                    {/* Header Banner */}
                    <div className="bg-gradient-to-r from-primary-500 to-primary-700 px-6 py-8">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center ring-4 ring-white/30">
                                <span className="text-2xl font-bold text-white">
                                    {customer?.name?.charAt(0) || user?.username?.charAt(0) || '?'}
                                </span>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">
                                    {customer?.name || user?.username}
                                </h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <p className="text-primary-100 text-sm">
                                        {customer?.customerID || user?.userID}
                                    </p>
                                    <Badge
                                        variant="primary"
                                        className="bg-white/20 text-white border-0"
                                    >
                                        {user?.role}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {isEditing ? (
                            /* ── Edit Mode ── */
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <h3 className="text-lg font-semibold text-text-primary mb-4">
                                    Edit Personal Information
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Input
                                        label="Full Name"
                                        icon={User}
                                        required
                                        error={errors.name?.message}
                                        {...register('name', {
                                            required: MESSAGES.REQUIRED,
                                            minLength: { value: 2, message: MESSAGES.MIN_NAME },
                                        })}
                                    />

                                    <Input
                                        label="Contact Number"
                                        icon={Phone}
                                        required
                                        error={errors.contactNumber?.message}
                                        {...register('contactNumber', {
                                            required: MESSAGES.REQUIRED,
                                            pattern: {
                                                value: PATTERNS.PHONE,
                                                message: MESSAGES.INVALID_PHONE,
                                            },
                                        })}
                                    />

                                    <Input
                                        label="Email"
                                        type="email"
                                        icon={Mail}
                                        required
                                        error={errors.email?.message}
                                        {...register('email', {
                                            required: MESSAGES.REQUIRED,
                                            pattern: {
                                                value: PATTERNS.EMAIL,
                                                message: MESSAGES.INVALID_EMAIL,
                                            },
                                        })}
                                    />

                                    <div className="sm:col-span-2">
                                        <Input
                                            label="Address"
                                            icon={MapPin}
                                            required
                                            error={errors.address?.message}
                                            {...register('address', {
                                                required: MESSAGES.REQUIRED,
                                            })}
                                        />
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-border-light">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleCancel}
                                        leftIcon={<X className="w-4 h-4" />}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        isLoading={isUpdating}
                                        disabled={!isDirty}
                                        leftIcon={<Save className="w-4 h-4" />}
                                    >
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            /* ── View Mode ── */
                            <>
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
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;