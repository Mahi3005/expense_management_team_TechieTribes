import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

export const RoleBasedRoute = ({ children, allowedRoles }) => {
    const { user, isLoading } = useAuth();

    // Show loading spinner while checking auth state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role?.toLowerCase())) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};
