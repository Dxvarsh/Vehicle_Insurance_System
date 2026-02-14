import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    loginUser,
    registerUser,
    logoutUser,
    getCurrentUser,
    forgotPassword,
    resetPassword,
    clearError,
    clearSuccessMessage,
    selectAuth,
} from '../store/slices/authSlice';
import { getDashboardRoute } from '../utils/helpers';
import toast from 'react-hot-toast';

const useAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const auth = useSelector(selectAuth);

    const handleLogin = async (credentials) => {
        try {
            const result = await dispatch(loginUser(credentials)).unwrap();
            toast.success('Login successful!');
            const dashboardRoute = getDashboardRoute(result.user.role);
            navigate(dashboardRoute, { replace: true });
            return result;
        } catch (error) {
            toast.error(error || 'Login failed');
            throw error;
        }
    };

    const handleRegister = async (userData) => {
        try {
            const result = await dispatch(registerUser(userData)).unwrap();
            toast.success('Registration successful!');
            navigate('/dashboard', { replace: true });
            return result;
        } catch (error) {
            toast.error(error || 'Registration failed');
            throw error;
        }
    };

    const handleLogout = async () => {
        try {
            await dispatch(logoutUser()).unwrap();
            toast.success('Logged out successfully');
            navigate('/login', { replace: true });
        } catch (error) {
            // Force logout even if API fails
            navigate('/login', { replace: true });
        }
    };

    const handleGetMe = async () => {
        try {
            await dispatch(getCurrentUser()).unwrap();
        } catch (error) {
            // Silent fail - user not authenticated
        }
    };

    const handleForgotPassword = async (email) => {
        try {
            const result = await dispatch(forgotPassword(email)).unwrap();
            toast.success(result.message || 'Reset link sent to your email');
            return result;
        } catch (error) {
            toast.error(error || 'Failed to send reset email');
            throw error;
        }
    };

    const handleResetPassword = async (token, passwordData) => {
        try {
            const result = await dispatch(resetPassword({ token, passwordData })).unwrap();
            toast.success(result.message || 'Password reset successful');
            navigate('/login', { replace: true });
            return result;
        } catch (error) {
            toast.error(error || 'Password reset failed');
            throw error;
        }
    };

    const handleClearError = () => {
        dispatch(clearError());
    };

    const handleClearSuccess = () => {
        dispatch(clearSuccessMessage());
    };

    return {
        ...auth,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        getMe: handleGetMe,
        forgotPassword: handleForgotPassword,
        resetPassword: handleResetPassword,
        clearError: handleClearError,
        clearSuccess: handleClearSuccess,
    };
};

export default useAuth;