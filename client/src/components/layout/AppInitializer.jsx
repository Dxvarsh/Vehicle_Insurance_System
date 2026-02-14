import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser, selectIsInitialized } from '../../store/slices/authSlice';
import { getToken } from '../../utils/helpers';
import { PageLoader } from '../common/Loader';

const AppInitializer = ({ children }) => {
    const dispatch = useDispatch();
    const isInitialized = useSelector(selectIsInitialized);

    useEffect(() => {
        const token = getToken();
        if (token) {
            dispatch(getCurrentUser());
        } else {
            // No token - mark as initialized immediately
            dispatch({ type: 'auth/getMe/rejected' });
        }
    }, [dispatch]);

    // Show loader until auth state is determined
    if (!isInitialized) {
        return <PageLoader />;
    }

    return children;
};

export default AppInitializer;