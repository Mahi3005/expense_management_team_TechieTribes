require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Expense = require('../models/Expense');
const ApprovalConfig = require('../models/ApprovalConfig');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected for seeding');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        process.exit(1);
    }
};

const seedDatabase = async () => {
    try {
        await connectDB();

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await User.deleteMany();
        await Expense.deleteMany();
        await ApprovalConfig.deleteMany();

        // Create users
        console.log('👥 Creating users...');
        
        // Admin
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@expense.com',
            password: 'admin123',
            role: 'admin',
            department: 'Administration'
        });

        // Managers
        const manager1 = await User.create({
            name: 'John Doe',
            email: 'john@expense.com',
            password: 'manager123',
            role: 'manager',
            department: 'Finance'
        });

        const manager2 = await User.create({
            name: 'Jane Smith',
            email: 'jane@expense.com',
            password: 'manager123',
            role: 'manager',
            department: 'Operations'
        });

        // Employees
        const employee1 = await User.create({
            name: 'Alice Johnson',
            email: 'alice@expense.com',
            password: 'employee123',
            role: 'employee',
            department: 'Marketing',
            managerId: manager1._id
        });

        const employee2 = await User.create({
            name: 'Bob Williams',
            email: 'bob@expense.com',
            password: 'employee123',
            role: 'employee',
            department: 'Engineering',
            managerId: manager1._id
        });

        const employee3 = await User.create({
            name: 'Carol Davis',
            email: 'carol@expense.com',
            password: 'employee123',
            role: 'employee',
            department: 'Sales',
            managerId: manager2._id
        });

        console.log('✅ Users created successfully');

        // Create approval configuration
        console.log('⚙️  Creating approval configuration...');
        
        const approvalConfig = await ApprovalConfig.create({
            isManagerApprover: true,
            approvalSequence: true,
            minApprovalPercentage: 60,
            conditionalRules: {
                percentageRule: true,
                specificApproverRule: false,
                hybridRule: false
            },
            approvalRules: [
                {
                    level: 1,
                    approver: manager1._id,
                    approverName: 'John Doe',
                    approverRole: 'Manager',
                    required: true,
                    description: 'Level 1: Manager Approval'
                },
                {
                    level: 2,
                    approver: manager2._id,
                    approverName: 'Jane Smith',
                    approverRole: 'Finance Team',
                    required: false,
                    description: 'Level 2: Finance Approval'
                },
                {
                    level: 3,
                    approver: admin._id,
                    approverName: 'Admin User',
                    approverRole: 'Director',
                    required: false,
                    description: 'Level 3: Director Approval'
                }
            ],
            isActive: true
        });

        console.log('✅ Approval configuration created successfully');

        // Create sample expenses
        console.log('💰 Creating sample expenses...');

        const expenses = [
            {
                employee: employee1._id,
                description: 'Team lunch at restaurant',
                amount: 498.96,
                currency: 'INR',
                category: 'Food',
                expenseDate: new Date('2025-09-15'),
                paidBy: 'Self',
                remarks: 'Team building activity',
                status: 'Approved',
                currentApprovalLevel: 3,
                approvalHistory: [
                    {
                        approver: manager1._id,
                        approverName: 'John Doe',
                        action: 'Approved',
                        comment: 'Approved for team building',
                        timestamp: new Date('2025-09-16'),
                        level: 1
                    }
                ]
            },
            {
                employee: employee2._id,
                description: 'Flight tickets for conference',
                amount: 30,
                currency: 'USD',
                category: 'Travel',
                expenseDate: new Date('2025-09-20'),
                paidBy: 'Company Card',
                remarks: 'Annual tech conference',
                status: 'Waiting Approval',
                currentApprovalLevel: 1,
                approvalHistory: []
            },
            {
                employee: employee3._id,
                description: 'Office supplies purchase',
                amount: 15,
                currency: 'EUR',
                category: 'Office Supplies',
                expenseDate: new Date('2025-09-25'),
                paidBy: 'Self',
                status: 'Waiting Approval',
                currentApprovalLevel: 1,
                approvalHistory: []
            },
            {
                employee: employee1._id,
                description: 'Software subscription',
                amount: 50,
                currency: 'GBP',
                category: 'Software',
                expenseDate: new Date('2025-09-28'),
                paidBy: 'Self',
                status: 'Waiting Approval',
                currentApprovalLevel: 1,
                approvalHistory: []
            },
            {
                employee: employee2._id,
                description: 'Training course fee',
                amount: 200,
                currency: 'AUD',
                category: 'Training',
                expenseDate: new Date('2025-10-01'),
                paidBy: 'Self',
                remarks: 'AWS certification training',
                status: 'Waiting Approval',
                currentApprovalLevel: 1,
                approvalHistory: []
            },
            {
                employee: employee3._id,
                description: 'Client meeting expenses',
                amount: 75,
                currency: 'USD',
                category: 'Food',
                expenseDate: new Date('2025-10-03'),
                paidBy: 'Self',
                status: 'Draft',
                currentApprovalLevel: 0,
                approvalHistory: []
            }
        ];

        await Expense.insertMany(expenses);

        console.log('✅ Sample expenses created successfully');

        console.log('\n📊 Database Seeding Summary:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`👥 Users: ${await User.countDocuments()}`);
        console.log(`   - Admins: ${await User.countDocuments({ role: 'admin' })}`);
        console.log(`   - Managers: ${await User.countDocuments({ role: 'manager' })}`);
        console.log(`   - Employees: ${await User.countDocuments({ role: 'employee' })}`);
        console.log(`💰 Expenses: ${await Expense.countDocuments()}`);
        console.log(`⚙️  Approval Configs: ${await ApprovalConfig.countDocuments()}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        console.log('\n🔑 Test Credentials:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Admin:    admin@expense.com / admin123');
        console.log('Manager1: john@expense.com / manager123');
        console.log('Manager2: jane@expense.com / manager123');
        console.log('Employee: alice@expense.com / employee123');
        console.log('Employee: bob@expense.com / employee123');
        console.log('Employee: carol@expense.com / employee123');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding Error:', error);
        process.exit(1);
    }
};

// Run seeding
seedDatabase();
