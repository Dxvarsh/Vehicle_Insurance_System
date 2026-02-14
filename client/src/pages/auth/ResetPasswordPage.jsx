import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Lock, KeyRound, ArrowLeft, CheckCircle } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Logo from '../../components/common/Logo';
import { PATTERNS, MESSAGES } from '../../utils/constants';

const ResetPasswordPage = () => {
    const { token } = useParams();
    const {
        resetPassword: handleResetPassword,
        isLoading,
        error,
        successMessage,
        clearError,
        clearSuccess,
    } = useAuth();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: { password: '', confirmPassword: '' },
    });

    const password = watch('password');

    useEffect(() => {
        return () => {
            clearError();
            clearSuccess();
        };
    }, []);

    const onSubmit = async (data) => {
        try {
            await handleResetPassword(token, {
                password: data.password,
                confirmPassword: data.confirmPassword,
            });
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
                    {/* Success State */}
                    {successMessage ? (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 bg-success-light rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-success" />
                            </div>
                            <h2 className="text-2xl font-bold text-text-primary mb-2">
                                Password Reset!
                            </h2>
                            <p className="text-text-secondary text-sm mb-6">
                                {successMessage}
                            </p>
                            <Link to="/login">
                                <Button fullWidth size="lg">
                                    Sign In with New Password
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* Header */}
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <KeyRound className="w-8 h-8 text-primary-500" />
                                </div>
                                <h2 className="text-2xl font-bold text-text-primary">
                                    Set New Password
                                </h2>
                                <p className="text-text-secondary mt-2 text-sm">
                                    Your new password must be different from previous passwords.
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

                            {/* Form */}
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                <Input
                                    label="New Password"
                                    type="password"
                                    placeholder="Min. 8 characters"
                                    icon={Lock}
                                    required
                                    helperText="Must include uppercase, lowercase, and a number"
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
                                    label="Confirm New Password"
                                    type="password"
                                    placeholder="Re-enter your password"
                                    icon={Lock}
                                    required
                                    error={errors.confirmPassword?.message}
                                    {...register('confirmPassword', {
                                        required: MESSAGES.REQUIRED,
                                        validate: (value) =>
                                            value === password || MESSAGES.PASSWORDS_NOT_MATCH,
                                    })}
                                />

                                <Button
                                    type="submit"
                                    fullWidth
                                    size="lg"
                                    isLoading={isLoading}
                                    leftIcon={<KeyRound className="w-5 h-5" />}
                                >
                                    Reset Password
                                </Button>
                            </form>

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
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;