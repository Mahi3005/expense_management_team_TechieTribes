const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res) => {
    try {
        // Filter by admin's company
        const users = await User.find({ companyId: req.user.companyId })
            .populate('managerId', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private (Admin)
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('managerId', 'name email role');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user',
            error: error.message
        });
    }
};

// @desc    Create user
// @route   POST /api/users
// @access  Private (Admin)
exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role, department, managerId } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Managers can only create employees (normalize roles to lowercase)
        if (req.user.role === 'manager' && role && role.toLowerCase() !== 'employee') {
            return res.status(403).json({
                success: false,
                message: 'Managers can only create employee accounts'
            });
        }

        const user = await User.create({
            name,
            email,
            password,
            role,
            department,
            managerId,
            companyId: req.user.companyId // Use admin's company
        });

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating user',
            error: error.message
        });
    }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin)
exports.updateUser = async (req, res) => {
    try {
        const { name, email, role, department, managerId, isActive } = req.body;

        // Check if user exists and belongs to same company
        const existingUser = await User.findById(req.params.id);
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Verify same company (admin can only edit users in their company)
        if (existingUser.companyId.toString() !== req.user.companyId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You can only update users in your company'
            });
        }

        // Managers can only edit employees (normalize roles to lowercase)
        if (req.user.role === 'manager' && existingUser.role.toLowerCase() !== 'employee') {
            return res.status(403).json({
                success: false,
                message: 'Managers can only edit employee accounts'
            });
        }

        // Managers cannot change role to admin or manager
        if (req.user.role === 'manager' && role && role.toLowerCase() !== 'employee') {
            return res.status(403).json({
                success: false,
                message: 'Managers can only create/edit employee accounts'
            });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, role, department, managerId, isActive },
            { new: true, runValidators: true }
        ).populate('managerId', 'name email');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating user',
            error: error.message
        });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Verify same company
        if (user.companyId.toString() !== req.user.companyId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You can only delete users in your company'
            });
        }

        // Managers can only delete employees (normalize roles to lowercase)
        if (req.user.role === 'manager' && user.role.toLowerCase() !== 'employee') {
            return res.status(403).json({
                success: false,
                message: 'Managers can only delete employee accounts'
            });
        }

        // Don't allow deleting yourself
        if (user._id.toString() === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete your own account'
            });
        }

        await user.deleteOne();

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting user',
            error: error.message
        });
    }
};

// @desc    Get managers list
// @route   GET /api/users/managers
// @access  Private
exports.getManagers = async (req, res) => {
    try {
        const managers = await User.find({ 
            role: { $in: ['manager', 'admin'] },
            isActive: true 
        }).select('name email role department');

        res.status(200).json({
            success: true,
            count: managers.length,
            data: managers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching managers',
            error: error.message
        });
    }
};

// @desc    Get managed users (team members)
// @route   GET /api/users/my-team
// @access  Private (Manager)
exports.getManagedUsers = async (req, res) => {
    try {
        const managerId = req.user.id;

        const teamMembers = await User.find({ 
            managerId: managerId,
            companyId: req.user.companyId // Same company only
        })
            .populate('managerId', 'name email')
            .select('name email department role isActive createdAt')
            .sort({ name: 1 });

        res.status(200).json({
            success: true,
            count: teamMembers.length,
            data: teamMembers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching team members',
            error: error.message
        });
    }
};

module.exports = exports;
