const Expense = require('../models/Expense');
const ApprovalConfig = require('../models/ApprovalConfig');
const User = require('../models/User');

// @desc    Create new expense
// @route   POST /api/expenses
// @access  Private
exports.createExpense = async (req, res) => {
    try {
        const {
            description,
            amount,
            currency,
            category,
            expenseDate,
            paidBy,
            remarks,
            ocrData
        } = req.body;

        // Validate required fields
        if (!description || !amount || !category || !expenseDate) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: description, amount, category, and expenseDate are required'
            });
        }

        // Validate user has companyId
        if (!req.user.companyId) {
            return res.status(400).json({
                success: false,
                message: 'User account is not associated with a company. Please contact your administrator.'
            });
        }

        const expense = await Expense.create({
            employee: req.user.id,
            companyId: req.user.companyId, // Add company isolation
            description,
            amount: parseFloat(amount),
            currency: currency || 'USD',
            category,
            expenseDate,
            paidBy: paidBy || 'Self',
            remarks,
            ocrData,
            receipt: req.file ? {
                filename: req.file.filename,
                path: req.file.path,
                mimetype: req.file.mimetype,
                size: req.file.size
            } : null,
            status: 'Draft'
        });

        const populatedExpense = await Expense.findById(expense._id)
            .populate('employee', 'name email department');

        res.status(201).json({
            success: true,
            message: 'Expense created successfully',
            data: populatedExpense
        });
    } catch (error) {
        console.error('Error creating expense:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating expense',
            error: error.message
        });
    }
};

// @desc    Get all expenses (with filtering)
// @route   GET /api/expenses
// @access  Private
exports.getExpenses = async (req, res) => {
    try {
        const { status, category, startDate, endDate } = req.query;
        let query = { companyId: req.user.companyId }; // Always filter by company

        // Role-based filtering
        if (req.user.role === 'employee') {
            query.employee = req.user.id;
        }

        // Status filter
        if (status) {
            query.status = status;
        }

        // Category filter
        if (category) {
            query.category = category;
        }

        // Date range filter
        if (startDate || endDate) {
            query.expenseDate = {};
            if (startDate) query.expenseDate.$gte = new Date(startDate);
            if (endDate) query.expenseDate.$lte = new Date(endDate);
        }

        const expenses = await Expense.find(query)
            .populate('employee', 'name email department')
            .populate('approvalHistory.approver', 'name email role')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: expenses.length,
            data: expenses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching expenses',
            error: error.message
        });
    }
};

// @desc    Get single expense
// @route   GET /api/expenses/:id
// @access  Private
exports.getExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id)
            .populate('employee', 'name email department')
            .populate('approvalHistory.approver', 'name email role');

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: 'Expense not found'
            });
        }

        // Check authorization
        if (req.user.role === 'employee' && expense.employee._id.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this expense'
            });
        }

        res.status(200).json({
            success: true,
            data: expense
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching expense',
            error: error.message
        });
    }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
exports.updateExpense = async (req, res) => {
    try {
        let expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: 'Expense not found'
            });
        }

        // Check authorization
        if (expense.employee.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this expense'
            });
        }

        // Don't allow updates to approved/rejected expenses
        if (['Approved', 'Rejected'].includes(expense.status)) {
            return res.status(400).json({
                success: false,
                message: 'Cannot update approved or rejected expenses'
            });
        }

        const {
            description,
            amount,
            currency,
            category,
            expenseDate,
            paidBy,
            remarks
        } = req.body;

        expense = await Expense.findByIdAndUpdate(
            req.params.id,
            {
                description,
                amount,
                currency,
                category,
                expenseDate,
                paidBy,
                remarks,
                ...(req.file && {
                    receipt: {
                        filename: req.file.filename,
                        path: req.file.path,
                        mimetype: req.file.mimetype,
                        size: req.file.size
                    }
                })
            },
            { new: true, runValidators: true }
        ).populate('employee', 'name email department');

        res.status(200).json({
            success: true,
            message: 'Expense updated successfully',
            data: expense
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating expense',
            error: error.message
        });
    }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
exports.deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: 'Expense not found'
            });
        }

        // Check authorization
        if (expense.employee.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this expense'
            });
        }

        // Don't allow deletion of approved expenses
        if (expense.status === 'Approved') {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete approved expenses'
            });
        }

        await expense.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Expense deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting expense',
            error: error.message
        });
    }
};

// @desc    Submit expense for approval
// @route   POST /api/expenses/:id/submit
// @access  Private
exports.submitExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: 'Expense not found'
            });
        }

        // Check authorization
        if (expense.employee.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to submit this expense'
            });
        }

        if (expense.status !== 'Draft') {
            return res.status(400).json({
                success: false,
                message: 'Only draft expenses can be submitted'
            });
        }

        expense.status = 'Waiting Approval';
        expense.currentApprovalLevel = 1;
        await expense.save();

        // Populate employee data before sending response
        const populatedExpense = await Expense.findById(expense._id)
            .populate('employee', 'name email department managerId');

        res.status(200).json({
            success: true,
            message: 'Expense submitted for approval',
            data: populatedExpense
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error submitting expense',
            error: error.message
        });
    }
};

// @desc    Get expenses pending approval
// @route   GET /api/expenses/pending-approval
// @access  Private (Manager/Admin)
exports.getPendingApprovals = async (req, res) => {
    try {
        let query = { 
            status: 'Waiting Approval',
            companyId: req.user.companyId // Same company only
        };

        // If manager, filter by level 1 (manager approval) and their managed employees
        if (req.user.role === 'manager') {
            // Find all employees managed by this manager in same company
            const managedEmployees = await User.find({ 
                managerId: req.user.id,
                companyId: req.user.companyId 
            });
            const employeeIds = managedEmployees.map(emp => emp._id);
            query.employee = { $in: employeeIds };
            query.currentApprovalLevel = 1; // Only level 1 (manager approval)
        }
        // If admin, filter by level 2 (admin approval)
        else if (req.user.role === 'admin') {
            query.currentApprovalLevel = 2; // Only level 2 (admin approval)
        }

        console.log('getPendingApprovals query:', JSON.stringify(query));
        const expenses = await Expense.find(query)
            .populate('employee', 'name email department managerId')
            .populate('approvalHistory.approver', 'name email role')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: expenses.length,
            data: expenses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching pending approvals',
            error: error.message
        });
    }
};

// @desc    Get all approved expenses by company
// @route   GET /api/expenses/approved
// @access  Private (Manager/Admin)
exports.getApprovedExpenses = async (req, res) => {
    try {
        const { startDate, endDate, category, employee } = req.query;
        let query = { 
            status: 'Approved',
            companyId: req.user.companyId
        };

        // Additional filters
        if (category) query.category = category;
        if (employee) query.employee = employee;
        
        if (startDate || endDate) {
            query.expenseDate = {};
            if (startDate) query.expenseDate.$gte = new Date(startDate);
            if (endDate) query.expenseDate.$lte = new Date(endDate);
        }

        const expenses = await Expense.find(query)
            .populate('employee', 'name email department')
            .populate('approvalHistory.approver', 'name email role')
            .sort({ expenseDate: -1 });

        // Calculate total amount
        const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

        res.status(200).json({
            success: true,
            count: expenses.length,
            totalAmount,
            data: expenses
        });
    } catch (error) {
        console.error('Error fetching approved expenses:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching approved expenses',
            error: error.message
        });
    }
};

// @desc    Get all rejected expenses by company
// @route   GET /api/expenses/rejected
// @access  Private (Manager/Admin)
exports.getRejectedExpenses = async (req, res) => {
    try {
        const { startDate, endDate, category, employee } = req.query;
        let query = { 
            status: 'Rejected',
            companyId: req.user.companyId
        };

        // Additional filters
        if (category) query.category = category;
        if (employee) query.employee = employee;
        
        if (startDate || endDate) {
            query.expenseDate = {};
            if (startDate) query.expenseDate.$gte = new Date(startDate);
            if (endDate) query.expenseDate.$lte = new Date(endDate);
        }

        const expenses = await Expense.find(query)
            .populate('employee', 'name email department')
            .populate('approvalHistory.approver', 'name email role')
            .sort({ updatedAt: -1 });

        res.status(200).json({
            success: true,
            count: expenses.length,
            data: expenses
        });
    } catch (error) {
        console.error('Error fetching rejected expenses:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching rejected expenses',
            error: error.message
        });
    }
};

// @desc    Get expense statistics by company
// @route   GET /api/expenses/statistics
// @access  Private (Manager/Admin)
exports.getExpenseStatistics = async (req, res) => {
    try {
        const companyId = req.user.companyId;

        // Get counts by status
        const [pending, approved, rejected, draft] = await Promise.all([
            Expense.countDocuments({ companyId, status: 'Waiting Approval' }),
            Expense.countDocuments({ companyId, status: 'Approved' }),
            Expense.countDocuments({ companyId, status: 'Rejected' }),
            Expense.countDocuments({ companyId, status: 'Draft' })
        ]);

        // Get total approved amount
        const approvedExpenses = await Expense.find({ companyId, status: 'Approved' });
        const totalApprovedAmount = approvedExpenses.reduce((sum, exp) => sum + exp.amount, 0);

        // Get monthly breakdown (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyData = await Expense.aggregate([
            {
                $match: {
                    companyId: req.user.companyId,
                    status: 'Approved',
                    expenseDate: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$expenseDate' },
                        month: { $month: '$expenseDate' }
                    },
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$amount' }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                statusCounts: {
                    pending,
                    approved,
                    rejected,
                    draft,
                    total: pending + approved + rejected + draft
                },
                totalApprovedAmount,
                monthlyBreakdown: monthlyData
            }
        });
    } catch (error) {
        console.error('Error fetching expense statistics:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching expense statistics',
            error: error.message
        });
    }
};

module.exports = exports;
