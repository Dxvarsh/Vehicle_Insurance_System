import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Logo from '../../components/common/Logo';
import { PATTERNS, MESSAGES } from '../../utils/constants';

const ForgotPasswordPage = () => {
    const {
        forgotPassword: handleForgotPassword,
        isLoading,
        error,
        successMessage,
        clearError,
        clearSuccess,
    } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: { email: '' },
    });

    useEffect(() => {
        return () => {
            clearError();
            clearSuccess();
        };
    }, []);

    const onSubmit = async (data) => {
        try {
            await handleForgotPassword(data.email);
        } catch (err) {
            // handled in hook
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Logo size="lg" className="justify-center" />
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Mail className="w-8 h-8 text-primary-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-text-primary">
                            Forgot Password?
                        </h2>
                        <p className="text-text-secondary mt-2 text-sm">
                            No worries! Enter your email and we'll send you a reset link.
                        </p>
                    </div>

                    {/* Success Message */}
                    {successMessage && (
                        <Alert
                            type="success"
                            title="Email Sent!"
                            message={successMessage}
                            className="mb-6"
                        />
                    )}

                    {/* Error Alert */}
                    {error && (
                        <Alert
                            type="error"
                            message={error}
                            onClose={clearError}
                            className="mb-6"
                        />
                    )}

                    {/* Form */}
                    {!successMessage && (
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

                            <Button
                                type="submit"
                                fullWidth
                                size="lg"
                                isLoading={isLoading}
                                leftIcon={<Send className="w-5 h-5" />}
                            >
                                Send Reset Link
                            </Button>
                        </form>
                    )}

                    {/* Back to Login */}
                    <div className="mt-6 text-center">
                        <Link
                            to="/login"
                            className="inline-flex items-center text-sm text-primary-500 hover:text-primary-600 font-medium transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;