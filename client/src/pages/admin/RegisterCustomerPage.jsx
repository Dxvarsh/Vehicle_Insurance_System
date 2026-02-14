import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Lock,
    UserPlus,
    ArrowLeft,
} from 'lucide-react';
import {
    staffRegisterCustomer,
    clearCustomerError,
    selectCustomers,
} from '../../store/slices/customerSlice';
import { PageHeader, Button, Input, Alert } from '../../components/common';
import { PATTERNS, MESSAGES } from '../../utils/constants';
import toast from 'react-hot-toast';

const RegisterCustomerPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isUpdating, error } = useSelector(selectCustomers);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: '',
            email: '',
            contactNumber: '',
            address: '',
            username: '',
            password: '',
            confirmPassword: '',
        },
    });

    const password = watch('password');

    useEffect(() => {
        return () => {
            dispatch(clearCustomerError());
        };
    }, [dispatch]);

    const onSubmit = async (data) => {
        const { confirmPassword, ...submitData } = data;
        try {
            await dispatch(staffRegisterCustomer(submitData)).unwrap();
            toast.success('Customer registered successfully!');
            navigate(-1);
        } catch (err) {
            toast.error(err || 'Registration failed');
        }
    };

    // Determine back path based on current URL
    const backPath = window.location.pathname.includes('/staff/')
        ? '/staff/customers'
        : '/admin/customers';

    return (
        <div>
            <PageHeader
                title="Register New Customer"
                subtitle="Create a new customer account with login credentials"
                breadcrumbs={[
                    { label: 'Dashboard', href: backPath.replace('/customers', '/dashboard') },
                    { label: 'Customers', href: backPath },
                    { label: 'Register' },
                ]}
            >
                <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<ArrowLeft className="w-4 h-4" />}
                    onClick={() => navigate(-1)}
                >
                    Back
                </Button>
            </PageHeader>

            <div className="max-w-2xl">
                {error && (
                    <Alert
                        type="error"
                        message={error}
                        onClose={() => dispatch(clearCustomerError())}
                        className="mb-6"
                    />
                )}

                <div className="bg-white rounded-xl shadow-sm border border-border-light p-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Personal Info Section */}
                        <div>
                            <h3 className="text-base font-semibold text-text-primary mb-4">
                                Personal Information
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    label="Full Name"
                                    placeholder="John Doe"
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
                                    placeholder="9876543210"
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

                                <div className="sm:col-span-2">
                                    <Input
                                        label="Email Address"
                                        type="email"
                                        placeholder="john@example.com"
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
                                </div>

                                <div className="sm:col-span-2">
                                    <Input
                                        label="Address"
                                        placeholder="123 Main Street, City, State"
                                        icon={MapPin}
                                        required
                                        error={errors.address?.message}
                                        {...register('address', {
                                            required: MESSAGES.REQUIRED,
                                        })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Account Section */}
                        <div className="pt-4 border-t border-border-light">
                            <h3 className="text-base font-semibold text-text-primary mb-4">
                                Account Credentials
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-2">
                                    <Input
                                        label="Username"
                                        placeholder="johndoe"
                                        icon={User}
                                        required
                                        helperText="Letters, numbers, and underscores only"
                                        error={errors.username?.message}
                                        {...register('username', {
                                            required: MESSAGES.REQUIRED,
                                            pattern: {
                                                value: PATTERNS.USERNAME,
                                                message: MESSAGES.INVALID_USERNAME,
                                            },
                                        })}
                                    />
                                </div>

                                <Input
                                    label="Password"
                                    type="password"
                                    placeholder="Min. 8 characters"
                                    icon={Lock}
                                    required
                                    helperText="Uppercase, lowercase & number"
                                    error={errors.password?.message}
                                    {...register('password', {
                                        required: MESSAGES.REQUIRED,
                                        pattern: {
                                            value: PATTERNS.PASSWORD,
                                            message: MESSAGES.INVALID_PASSWORD,
                                        },
                                    })}
                                />

                                <Input
                                    label="Confirm Password"
                                    type="password"
                                    placeholder="Re-enter password"
                                    icon={Lock}
                                    required
                                    error={errors.confirmPassword?.message}
                                    {...register('confirmPassword', {
                                        required: MESSAGES.REQUIRED,
                                        validate: (value) =>
                                            value === password || MESSAGES.PASSWORDS_NOT_MATCH,
                                    })}
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-light">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                isLoading={isUpdating}
                                leftIcon={<UserPlus className="w-4 h-4" />}
                            >
                                Register Customer
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterCustomerPage;