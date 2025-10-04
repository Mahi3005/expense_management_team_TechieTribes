const User = require('../models/User');
const Company = require('../models/Company');
const ApprovalConfig = require('../models/ApprovalConfig');
const { generateToken } = require('../middleware/auth');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { name, email, password, role, department, companyName, country, currency, currencySymbol } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        let companyId;
        const normalizedRole = (role || 'employee').toLowerCase();

        // If admin signup, create new company
        if (normalizedRole === 'admin') {
            if (!companyName || !country || !currency) {
                return res.status(400).json({
                    success: false,
                    message: 'Company name, country, and currency are required for admin registration'
                });
            }

            // Create company first (without adminId)
            const company = await Company.create({
                name: companyName,
                country,
                currency: currency.toUpperCase(),
                currencySymbol: currencySymbol || '$',
                adminId: null // Will update after user creation
            });

            companyId = company._id;

            // Create admin user
            const user = await User.create({
                name,
                email,
                password,
                role: 'admin',
                department: department || 'Management',
                companyId
            });

            // Update company with admin ID
            company.adminId = user._id;
            await company.save();

            // Create default approval configuration
            await ApprovalConfig.create({
                companyId: company._id,
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

            // Generate token
            const token = generateToken(user._id);

            return res.status(201).json({
                success: true,
                message: 'Admin registered and company created successfully',
                data: {
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        department: user.department,
                        companyId: user.companyId
                    },
                    company: {
                        id: company._id,
                        name: company.name,
                        currency: company.currency,
                        currencySymbol: company.currencySymbol,
                        country: company.country
                    },
                    token
                }
            });
        } else {
            // Non-admin users must be created by admin (shouldn't reach here via public signup)
            return res.status(403).json({
                success: false,
                message: 'Only admins can register publicly. Other users must be created by admin.'
            });
        }
    } catch (error) {
        console.error('Registration error details:', error);
        res.status(500).json({
            success: false,
            message: 'Error in user registration',
            error: error.message
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate email & password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Check for user (include password for comparison)
        const user = await User.findOne({ email }).select('+password').populate('companyId', 'name currency currencySymbol country');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'User account is inactive'
            });
        }

        // Check if password matches
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    department: user.department,
                    companyId: user.companyId?._id
                },
                company: user.companyId ? {
                    id: user.companyId._id,
                    name: user.companyId.name,
                    currency: user.companyId.currency,
                    currencySymbol: user.companyId.currencySymbol,
                    country: user.companyId.country
                } : null,
                token
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error in login',
            error: error.message
        });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('managerId', 'name email');
        
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user data',
            error: error.message
        });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const { name, department } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name, department },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
};
