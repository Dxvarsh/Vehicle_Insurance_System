import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
    Mail, Lock, User, Phone, MapPin, UserPlus, ArrowRight, ShieldCheck,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Logo from '../../components/common/Logo';
import { PATTERNS, MESSAGES } from '../../utils/constants';

const RegisterPage = () => {
    const { register: registerUser, isLoading, error, clearError } = useAuth();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: '',
            username: '',
            email: '',
            contactNumber: '',
            address: '',
            password: '',
            confirmPassword: '',
        },
    });

    const password = watch('password');

    useEffect(() => {
        return () => clearError();
    }, []);

    const onSubmit = async (data) => {
        const { confirmPassword, ...userData } = data;
        try {
            await registerUser(userData);
        } catch (err) {
            // Error handled in useAuth hook
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex">
            {/* ── Left Side - Branding (Desktop Only) ── */}
            <div className="hidden lg:flex lg:w-5/12 bg-primary-500 relative overflow-hidden items-center justify-center">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-300 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 px-12 max-w-lg">
                    <div className="mb-8">
                        <Logo size="lg" showText={false} />
                    </div>
                    <h1 className="text-4xl font-bold text-white leading-tight mb-6">
                        Get Started with SecureInsure
                    </h1>
                    <p className="text-primary-100 text-lg leading-relaxed mb-8">
                        Create your account and get comprehensive vehicle insurance coverage
                        in minutes.
                    </p>

                    {/* Benefits */}
                    <div className="space-y-4">
                        {[
                            { icon: ShieldCheck, text: 'Quick & easy registration' },
                            { icon: ShieldCheck, text: 'Multiple coverage options' },
                            { icon: ShieldCheck, text: 'Instant policy activation' },
                            { icon: ShieldCheck, text: '24/7 claim support' },
                        ].map(({ icon: Icon, text }, idx) => (
                            <div key={idx} className="flex items-center text-primary-100">
                                <Icon className="w-5 h-5 mr-3 text-primary-200" />
                                <span className="text-sm">{text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Right Side - Register Form ── */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12">
                <div className="w-full max-w-lg">
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-6">
                        <Logo size="lg" className="justify-center" />
                    </div>

                    {/* Header */}
                    <div className="text-center lg:text-left mb-6">
                        <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
                            Create Account
                        </h2>
                        <p className="text-text-secondary mt-2">
                            Fill in your details to get started
                        </p>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <Alert
                            type="error"
                            message={error}
                            onClose={clearError}
                            className="mb-6"
                        />
                    )}

                    {/* Register Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Name & Username - Two Column */}
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
                                label="Username"
                                placeholder="johndoe"
                                icon={User}
                                required
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

                        {/* Email & Phone - Two Column */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                                label="Email Address"
                                type="email"
                                placeholder="you@example.com"
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
                        </div>

                        {/* Address */}
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

                        {/* Password & Confirm Password - Two Column */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                                label="Password"
                                type="password"
                                placeholder="Min. 8 characters"
                                icon={Lock}
                                required
                                error={errors.password?.message}
                                helperText="Uppercase, lowercase & number required"
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

                        {/* Terms */}
                        <label className="flex items-start cursor-pointer">
                            <input
                                type="checkbox"
                                className="w-4 h-4 mt-0.5 rounded border-border-main text-primary-500 focus:ring-primary-500 cursor-pointer"
                                required
                            />
                            <span className="ml-3 text-sm text-text-secondary">
                                I agree to the{' '}
                                <a href="#" className="text-primary-500 hover:text-primary-600 font-medium">
                                    Terms of Service
                                </a>{' '}
                                and{' '}
                                <a href="#" className="text-primary-500 hover:text-primary-600 font-medium">
                                    Privacy Policy
                                </a>
                            </span>
                        </label>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            fullWidth
                            size="lg"
                            isLoading={isLoading}
                            leftIcon={<UserPlus className="w-5 h-5" />}
                        >
                            Create Account
                        </Button>
                    </form>

                    {/* Login Link */}
                    <p className="text-center text-sm text-text-secondary mt-6">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="text-primary-500 hover:text-primary-600 font-semibold transition-colors"
                        >
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;