const Expense = require('../models/Expense');
const ApprovalConfig = require('../models/ApprovalConfig');
const User = require('../models/User');

// @desc    Approve expense
// @route   POST /api/approvals/:expenseId/approve
// @access  Private (Manager/Admin)
exports.approveExpense = async (req, res) => {
    try {
        const { expenseId } = req.params;
        const { comment } = req.body;

        const expense = await Expense.findById(expenseId).populate('employee', 'name email managerId');
        if (!expense) {
            return res.status(404).json({
                success: false,
                message: 'Expense not found'
            });
        }

        console.log(`Approve attempt: expenseId=${expenseId}, status=${expense.status}, level=${expense.currentApprovalLevel}, userRole=${req.user.role}`);

        if (expense.status !== 'Waiting Approval') {
            console.error(`Cannot approve: expense status is '${expense.status}' instead of 'Waiting Approval'`);
            return res.status(400).json({
                success: false,
                message: `Expense is not pending approval (current status: ${expense.status})`
            });
        }

        // Ensure company ID is valid
        if (!req.user.companyId) {
            return res.status(400).json({
                success: false,
                message: 'User company information is missing'
            });
        }

        // Get approval configuration for this company
        let approvalConfig = await ApprovalConfig.findOne({ 
            companyId: req.user.companyId,
            isActive: true 
        }).populate('approvalRules.approver', 'name email role');

        // If no config exists, create a default one
        if (!approvalConfig) {
            console.log(`Creating default approval config for company: ${req.user.companyId}`);
            try {
                approvalConfig = await ApprovalConfig.create({
                    companyId: req.user.companyId,
                    isManagerApprover: true,
                    approvalSequence: true,
                    minApprovalPercentage: 60,
                    conditionalRules: {
                        percentageRule: false,
                        specificApproverRule: false,
                        hybridRule: false
                    },
                    approvalRules: [],
                    isActive: true
                });
                console.log(`Default approval config created successfully`);
            } catch (configError) {
                console.error('Error creating default approval config:', configError);
                return res.status(500).json({
                    success: false,
                    message: 'Error creating approval configuration',
                    error: configError.message
                });
            }
        }

        // Check if user is authorized to approve
        if (req.user.role === 'manager') {
            // Manager can only approve expenses from their team members
            const employee = await User.findById(expense.employee._id || expense.employee);
            if (!employee || employee.managerId?.toString() !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: 'You are not authorized to approve this expense'
                });
            }
        }
        // Admins can approve any expense (no additional check needed)

        // Add approval to history
        expense.approvalHistory.push({
            approver: req.user.id,
            approverName: req.user.name,
            action: 'Approved',
            comment: comment || '',
            timestamp: new Date(),
            level: expense.currentApprovalLevel
        });

        // Two-level approval workflow: Manager (1) → Admin (2) → Final
        const currentLevel = expense.currentApprovalLevel;
        console.log(`Approval: currentLevel=${currentLevel}, userRole=${req.user.role}, expenseId=${expense._id}`);
        
        // If manager approved (level 1), move to admin approval (level 2)
        if (currentLevel === 1 && req.user.role === 'manager') {
            expense.currentApprovalLevel = 2;
            expense.status = 'Waiting Approval'; // Now waiting for admin
            console.log(`Manager approved: Moving to level 2 for admin approval`);
        } 
        // If admin approved (level 2), it's final approval
        else if (currentLevel === 2 && req.user.role === 'admin') {
            expense.status = 'Approved'; // Final approval
            console.log(`Admin approved: Final approval at level 2`);
        }
        // If admin approves directly (level 1), it's final
        else if (currentLevel === 1 && req.user.role === 'admin') {
            expense.status = 'Approved'; // Admin can give direct final approval
            console.log(`Admin approved: Direct final approval at level 1`);
        }
        // Default: mark as approved
        else {
            expense.status = 'Approved';
            console.log(`Default approval: currentLevel=${currentLevel}, role=${req.user.role}`);
        }

        await expense.save();

        const updatedExpense = await Expense.findById(expenseId)
            .populate('employee', 'name email department')
            .populate('approvalHistory.approver', 'name email role');

        res.status(200).json({
            success: true,
            message: expense.status === 'Approved' ? 'Expense approved successfully' : 'Approval recorded, awaiting next level',
            data: updatedExpense
        });
    } catch (error) {
        console.error('Error approving expense:', error);
        res.status(500).json({
            success: false,
            message: 'Error approving expense',
            error: error.message
        });
    }
};

// @desc    Reject expense
// @route   POST /api/approvals/:expenseId/reject
// @access  Private (Manager/Admin)
exports.rejectExpense = async (req, res) => {
    try {
        const { expenseId } = req.params;
        const { comment } = req.body;

        if (!comment) {
            return res.status(400).json({
                success: false,
                message: 'Comment is required when rejecting an expense'
            });
        }

        const expense = await Expense.findById(expenseId).populate('employee', 'name email managerId');
        if (!expense) {
            return res.status(404).json({
                success: false,
                message: 'Expense not found'
            });
        }

        if (expense.status !== 'Waiting Approval') {
            return res.status(400).json({
                success: false,
                message: 'Expense is not pending approval'
            });
        }

        // Check if user is authorized to reject
        if (req.user.role === 'manager') {
            // Manager can only reject expenses from their team members
            const employee = await User.findById(expense.employee._id || expense.employee);
            if (!employee || employee.managerId?.toString() !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: 'You are not authorized to reject this expense'
                });
            }
        }
        // Admins can reject any expense (no additional check needed)

        // Add rejection to history
        expense.approvalHistory.push({
            approver: req.user.id,
            approverName: req.user.name,
            action: 'Rejected',
            comment,
            timestamp: new Date(),
            level: expense.currentApprovalLevel
        });

        expense.status = 'Rejected';

        await expense.save();

        const updatedExpense = await Expense.findById(expenseId)
            .populate('employee', 'name email department')
            .populate('approvalHistory.approver', 'name email role');

        res.status(200).json({
            success: true,
            message: 'Expense rejected',
            data: updatedExpense
        });
    } catch (error) {
        console.error('Error rejecting expense:', error);
        res.status(500).json({
            success: false,
            message: 'Error rejecting expense',
            error: error.message
        });
    }
};

// @desc    Get approval configuration
// @route   GET /api/approvals/config
// @access  Private (Admin)
exports.getApprovalConfig = async (req, res) => {
    try {
        const config = await ApprovalConfig.findOne({ 
            companyId: req.user.companyId,
            isActive: true 
        })
            .populate('approvalRules.approver', 'name email role department');

        if (!config) {
            // Return default config if none exists
            return res.status(200).json({
                success: true,
                data: {
                    isManagerApprover: true,
                    approvalSequence: true,
                    minApprovalPercentage: 60,
                    conditionalRules: {
                        percentageRule: true,
                        specificApproverRule: false,
                        hybridRule: false
                    },
                    approvalRules: []
                }
            });
        }

        res.status(200).json({
            success: true,
            data: config
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching approval configuration',
            error: error.message
        });
    }
};

// @desc    Update approval configuration
// @route   PUT /api/approvals/config
// @access  Private (Admin)
exports.updateApprovalConfig = async (req, res) => {
    try {
        const {
            isManagerApprover,
            approvalSequence,
            minApprovalPercentage,
            conditionalRules,
            approvalRules,
            levels // Also accept 'levels' from frontend
        } = req.body;

        console.log('Updating approval config for company:', req.user.companyId);
        console.log('Received data:', { isManagerApprover, approvalSequence, minApprovalPercentage, conditionalRules });

        // Use approvalRules or levels (for backward compatibility)
        const rules = approvalRules || levels || [];

        // Validate minApprovalPercentage
        if (minApprovalPercentage !== undefined && (minApprovalPercentage < 0 || minApprovalPercentage > 100)) {
            return res.status(400).json({
                success: false,
                message: 'Minimum approval percentage must be between 0 and 100'
            });
        }

        // Find existing config for this company or create new one
        const config = await ApprovalConfig.findOneAndUpdate(
            { companyId: req.user.companyId },
            {
                companyId: req.user.companyId,
                isManagerApprover: isManagerApprover !== undefined ? isManagerApprover : true,
                approvalSequence: approvalSequence !== undefined ? approvalSequence : true,
                minApprovalPercentage: minApprovalPercentage !== undefined ? minApprovalPercentage : 60,
                conditionalRules: conditionalRules || {
                    percentageRule: false,
                    specificApproverRule: false,
                    hybridRule: false
                },
                approvalRules: rules,
                isActive: true
            },
            {
                new: true,
                upsert: true, // Create if doesn't exist
                runValidators: true
            }
        );

        const populatedConfig = await ApprovalConfig.findById(config._id)
            .populate('approvalRules.approver', 'name email role department');

        res.status(200).json({
            success: true,
            message: 'Approval configuration updated successfully',
            data: populatedConfig
        });
    } catch (error) {
        console.error('Error updating approval config:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating approval configuration',
            error: error.message
        });
    }
};

// @desc    Get approval history for an expense
// @route   GET /api/approvals/:expenseId/history
// @access  Private
exports.getApprovalHistory = async (req, res) => {
    try {
        const { expenseId } = req.params;

        const expense = await Expense.findById(expenseId)
            .populate('approvalHistory.approver', 'name email role department');

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: 'Expense not found'
            });
        }

        res.status(200).json({
            success: true,
            data: expense.approvalHistory
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching approval history',
            error: error.message
        });
    }
};

module.exports = exports;
