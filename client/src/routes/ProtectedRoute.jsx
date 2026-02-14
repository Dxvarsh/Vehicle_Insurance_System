import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuth } from '../store/slices/authSlice';
import { PageLoader } from '../components/common/Loader';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { isAuthenticated, isInitialized, user, isLoading } = useSelector(selectAuth);
    const location = useLocation();

    // Still checking auth status
    if (!isInitialized || isLoading) {
        return <PageLoader />;
    }

    // Not authenticated - redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Role-based access check
    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;