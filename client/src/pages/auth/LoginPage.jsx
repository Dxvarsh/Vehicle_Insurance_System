import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Logo from '../../components/common/Logo';
import { PATTERNS, MESSAGES } from '../../utils/constants';

const LoginPage = () => {
    const { login, isLoading, error, clearError } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
    });

    // Clear errors on unmount
    useEffect(() => {
        return () => clearError();
    }, []);

    const onSubmit = async (data) => {
        try {
            await login(data);
        } catch (err) {
            // Error handled in useAuth hook
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex">
            {/* ── Left Side - Branding (Desktop Only) ── */}
            <div className="hidden lg:flex lg:w-1/2 bg-primary-500 relative overflow-hidden items-center justify-center">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-300 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 px-12 max-w-lg">
                    <div className="mb-8">
                        <Logo size="lg" showText={false} />
                    </div>
                    <h1 className="text-4xl font-bold text-white leading-tight mb-6">
                        Protect What Matters Most
                    </h1>
                    <p className="text-primary-100 text-lg leading-relaxed mb-8">
                        Comprehensive vehicle insurance management at your fingertips.
                        Secure, transparent, and hassle-free.
                    </p>

                    {/* Trust Features */}
                    <div className="space-y-4">
                        {[
                            'Instant policy purchase & renewal',
                            'Track claims in real-time',
                            'Transparent premium calculation',
                            'Secure & encrypted data',
                        ].map((feature, idx) => (
                            <div key={idx} className="flex items-center text-primary-100">
                                <div className="w-6 h-6 rounded-full bg-primary-400 flex items-center justify-center mr-3 flex-shrink-0">
                                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                                </div>
                                <span className="text-sm">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Right Side - Login Form ── */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-8">
                        <Logo size="lg" className="justify-center" />
                    </div>

                    {/* Header */}
                    <div className="text-center lg:text-left mb-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
                            Welcome Back
                        </h2>
                        <p className="text-text-secondary mt-2">
                            Sign in to your account to continue
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

                    {/* Login Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            icon={Lock}
                            required
                            error={errors.password?.message}
                            {...register('password', {
                                required: MESSAGES.REQUIRED,
                            })}
                        />

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-border-main text-primary-500 focus:ring-primary-500 cursor-pointer"
                                />
                                <span className="ml-2 text-sm text-text-secondary">
                                    Remember me
                                </span>
                            </label>
                            <Link
                                to="/forgot-password"
                                className="text-sm text-primary-500 hover:text-primary-600 font-medium transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            fullWidth
                            size="lg"
                            isLoading={isLoading}
                            leftIcon={<LogIn className="w-5 h-5" />}
                        >
                            Sign In
                        </Button>
                    </form>

                    {/* Register Link */}
                    <p className="text-center text-sm text-text-secondary mt-8">
                        Don't have an account?{' '}
                        <Link
                            to="/register"
                            className="text-primary-500 hover:text-primary-600 font-semibold transition-colors"
                        >
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;