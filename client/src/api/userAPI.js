import api from './axiosConfig';

export const userAPI = {
    // Get all users (Admin)
    getAllUsers: async () => {
        return await api.get('/users');
    },

    // Get single user (Admin)
    getUser: async (id) => {
        return await api.get(`/users/${id}`);
    },

    // Create user (Admin)
    createUser: async (userData) => {
        return await api.post('/users', userData);
    },

    // Update user (Admin)
    updateUser: async (id, userData) => {
        return await api.put(`/users/${id}`, userData);
    },

    // Delete user (Admin)
    deleteUser: async (id) => {
        return await api.delete(`/users/${id}`);
    },

    // Get managers list
    getManagers: async () => {
        return await api.get('/users/managers');
    },

    // Get managed users (Manager only - get team members)
    getManagedUsers: async () => {
        return await api.get('/users/my-team');
    },
};
