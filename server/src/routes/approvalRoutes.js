const express = require('express');
const router = express.Router();
const {
    approveExpense,
    rejectExpense,
    getApprovalConfig,
    updateApprovalConfig,
    getApprovalHistory
} = require('../controllers/approvalController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Approval actions
router.post('/:expenseId/approve', authorize('manager', 'admin'), approveExpense);
router.post('/:expenseId/reject', authorize('manager', 'admin'), rejectExpense);
router.get('/:expenseId/history', getApprovalHistory);

// Approval configuration (Admin only)
router
    .route('/config')
    .get(authorize('admin'), getApprovalConfig)
    .put(authorize('admin'), updateApprovalConfig);

module.exports = router;
