import api from './axiosConfig';

export const authAPI = {
    // Register new user
    register: async (userData) => {
        return await api.post('/auth/register', userData);
    },

    // Login user
    login: async (credentials) => {
        return await api.post('/auth/login', credentials);
    },

    // Get current user
    getMe: async () => {
        return await api.get('/auth/me');
    },

    // Update profile
    updateProfile: async (userData) => {
        return await api.put('/auth/profile', userData);
    },
};
