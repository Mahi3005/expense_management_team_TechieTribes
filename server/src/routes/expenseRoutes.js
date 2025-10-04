const express = require('express');
const router = express.Router();
const {
    createExpense,
    getExpenses,
    getExpense,
    updateExpense,
    deleteExpense,
    submitExpense,
    getPendingApprovals,
    getApprovedExpenses,
    getRejectedExpenses,
    getExpenseStatistics
} = require('../controllers/expenseController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// All routes require authentication
router.use(protect);

// Expense routes
router
    .route('/')
    .get(getExpenses)
    .post(upload.single('receipt'), createExpense);

// Status-specific routes (must be before /:id routes)
router.get('/pending-approval', authorize('manager', 'admin'), getPendingApprovals);
router.get('/approved', authorize('manager', 'admin'), getApprovedExpenses);
router.get('/rejected', authorize('manager', 'admin'), getRejectedExpenses);
router.get('/statistics', authorize('manager', 'admin'), getExpenseStatistics);

router
    .route('/:id')
    .get(getExpense)
    .put(upload.single('receipt'), updateExpense)
    .delete(deleteExpense);

router.post('/:id/submit', submitExpense);

module.exports = router;
