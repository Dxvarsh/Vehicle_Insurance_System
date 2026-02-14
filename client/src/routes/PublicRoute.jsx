import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuth } from '../store/slices/authSlice';
import { getDashboardRoute } from '../utils/helpers';
import { PageLoader } from '../components/common/Loader';

const PublicRoute = ({ children }) => {
    const { isAuthenticated, isInitialized, user, isLoading } = useSelector(selectAuth);

    // Still checking auth status
    if (!isInitialized || isLoading) {
        return <PageLoader />;
    }

    // Already logged in - redirect to dashboard
    if (isAuthenticated && user) {
        const dashboardRoute = getDashboardRoute(user.role);
        return <Navigate to={dashboardRoute} replace />;
    }

    return children;
};

export default PublicRoute;