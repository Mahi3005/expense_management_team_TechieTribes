import api from './axiosConfig';

export const approvalAPI = {
    // Approve expense
    approveExpense: async (expenseId, data) => {
        return await api.post(`/approvals/${expenseId}/approve`, data);
    },

    // Reject expense
    rejectExpense: async (expenseId, data) => {
        return await api.post(`/approvals/${expenseId}/reject`, data);
    },

    // Get approval history
    getApprovalHistory: async (expenseId) => {
        return await api.get(`/approvals/${expenseId}/history`);
    },

    // Get approval configuration
    getApprovalConfig: async () => {
        return await api.get('/approvals/config');
    },

    // Update approval configuration
    updateApprovalConfig: async (config) => {
        return await api.put('/approvals/config', config);
    },
};
