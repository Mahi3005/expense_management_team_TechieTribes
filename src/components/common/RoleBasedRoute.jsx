import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const RoleBasedRoute = ({ children, allowedRoles }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role?.toLowerCase())) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};
