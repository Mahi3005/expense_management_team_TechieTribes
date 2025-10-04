import api from './axiosConfig';

export const expenseAPI = {
    // Get all expenses
    getExpenses: async (params) => {
        return await api.get('/expenses', { params });
    },

    // Get single expense
    getExpense: async (id) => {
        return await api.get(`/expenses/${id}`);
    },

    // Create new expense
    createExpense: async (formData) => {
        return await api.post('/expenses', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    // Update expense
    updateExpense: async (id, formData) => {
        return await api.put(`/expenses/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    // Delete expense
    deleteExpense: async (id) => {
        return await api.delete(`/expenses/${id}`);
    },

    // Submit expense for approval
    submitExpense: async (id) => {
        return await api.post(`/expenses/${id}/submit`);
    },

    // Get pending approvals (Manager/Admin)
    getPendingApprovals: async () => {
        return await api.get('/expenses/pending-approval');
    },

    // Get approved expenses with filters (Manager/Admin)
    getApprovedExpenses: async (params) => {
        return await api.get('/expenses/approved', { params });
    },

    // Get rejected expenses with filters (Manager/Admin)
    getRejectedExpenses: async (params) => {
        return await api.get('/expenses/rejected', { params });
    },

    // Get expense statistics (Manager/Admin)
    getExpenseStatistics: async () => {
        return await api.get('/expenses/statistics');
    },
};
