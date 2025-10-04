import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Add auth token to all requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response) {
            // Server responded with error status
            const message = error.response.data?.message || error.response.data?.error || 'An error occurred';
            
            // Handle 401 Unauthorized - only redirect if it's an auth error, not on page load
            if (error.response.status === 401) {
                // Check if this is due to actual expired/invalid token (not just page refresh)
                const isAuthRequest = error.config?.url?.includes('/auth/');
                
                // Only clear storage and redirect if it's not an auth request
                if (!isAuthRequest) {
                    const hasToken = localStorage.getItem('token');
                    if (hasToken) {
                        // Token exists but invalid - clear and redirect
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        localStorage.removeItem('userRole');
                        localStorage.removeItem('company');
                        
                        // Only redirect if not already on login page
                        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
                            window.location.href = '/login';
                        }
                    }
                }
            }
            
            return Promise.reject(new Error(message));
        } else if (error.request) {
            // Request made but no response
            return Promise.reject(new Error('Cannot connect to server. Please check if the backend is running.'));
        } else {
            // Error in request setup
            return Promise.reject(new Error(error.message));
        }
    }
);

export default api;
