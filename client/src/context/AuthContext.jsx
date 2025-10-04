import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for stored user on mount (page refresh)
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        
        if (storedUser && storedToken) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                console.log('User restored from localStorage:', parsedUser);
            } catch (error) {
                console.error('Error parsing stored user:', error);
                // Clear invalid data
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
        setIsLoading(false);
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('company');
        localStorage.removeItem('currency');
        localStorage.removeItem('currencySymbol');
    };

    const isAuthenticated = () => {
        return !!user;
    };

    const hasRole = (role) => {
        return user?.role?.toLowerCase() === role.toLowerCase();
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                isAuthenticated,
                hasRole,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
