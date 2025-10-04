// Mock login credentials
export const mockLoginCredentials = [
    {
        username: 'jj',
        password: '123',
        role: 'admin',
        name: 'Admin User',
        email: 'admin@company.com',
        id: 0
    },
    {
        username: 'john',
        password: '123',
        role: 'manager',
        name: 'John Doe',
        email: 'john@company.com',
        id: 1
    },
    {
        username: 'sarah',
        password: '123',
        role: 'employee',
        name: 'Sarah Smith',
        email: 'sarah@company.com',
        id: 2
    }
];

// Mock user data
export const mockUsers = [
    {
        id: 1,
        name: 'John Doe',
        role: 'Manager',
        managedBy: 'admin',
        email: 'john@company.com',
        status: 'active'
    },
    {
        id: 2,
        name: 'Sarah Smith',
        role: 'Employee',
        managedBy: 'John',
        email: 'sarah@company.com',
        status: 'active'
    },
    {
        id: 3,
        name: 'Michael Brown',
        role: 'Employee',
        managedBy: 'John',
        email: 'michael@company.com',
        status: 'active'
    },
];

// Mock approval rules
export const mockApprovalRules = [
    {
        id: 1,
        level: 1,
        approver: 'John Doe',
        required: true,
        description: 'Level 1 Manager Approval'
    },
    {
        id: 2,
        level: 2,
        approver: 'Finance Team',
        required: false,
        description: 'Level 2 Finance Review'
    },
    {
        id: 3,
        level: 3,
        approver: 'Director',
        required: false,
        description: 'Level 3 Director Approval'
    }
];

// Approval rule configuration
export const mockApprovalConfiguration = {
    isManagerApprover: true,
    approvalSequence: true,
    minApprovalPercentage: 60,
    conditionalRules: {
        percentageRule: true, // If 60% approve → Expense approved
        specificApproverRule: false, // If CFO approves → Auto-approved
        hybridRule: false // Combine both rules
    }
};

// Mock admin data
export const mockAdmin = {
    id: 1,
    name: 'Admin User',
    email: 'admin@company.com',
    role: 'Admin',
    companyName: 'TechieTribes Inc.',
    country: 'United States',
    currency: 'USD',
    currencySymbol: '$'
};

// Mock expenses data
export const mockExpenses = [
    {
        id: 1,
        employee: 'Exclusive Fall',
        description: 'Flight tickets for client meeting',
        date: '8th Oct, 2025',
        category: 'Travel',
        paidBy: 'Sarah',
        remarks: 'Client visit to NYC office',
        amount: '5000 rs',
        status: 'Approved'
    },
    {
        id: 2,
        employee: 'Exclusive Fall',
        description: 'Hotel accommodation',
        date: '7th Oct, 2025',
        category: 'Accommodation',
        paidBy: 'Sarah',
        remarks: '',
        amount: '3369 rs',
        status: 'Waiting Approval'
    },
    {
        id: 3,
        employee: 'Exclusive Fall',
        description: 'Team lunch',
        date: '6th Oct, 2025',
        category: 'Food',
        paidBy: 'Sarah',
        remarks: 'Monthly team gathering',
        amount: '500 rs',
        status: 'Submitted'
    }
];

// Mock expenses for manager approval view
export const mockApprovalExpenses = [
    {
        id: 1,
        approvalSubject: 'none',
        paidBy: 'Sarah',
        category: 'Food',
        status: 'Approved',
        amount: 'INR 498.96',
        description: 'Team lunch at restaurant',
        date: '8th Oct, 2025',
        remarks: 'Monthly team gathering with clients'
    },
    {
        id: 2,
        approvalSubject: 'none',
        paidBy: 'Michael Brown',
        category: 'Travel',
        status: 'Waiting Approval',
        amount: 'USD 30',
        description: 'Cab fare for client meeting',
        date: '7th Oct, 2025',
        remarks: 'Urgent client visit - downtown office'
    },
    {
        id: 3,
        approvalSubject: 'none',
        paidBy: 'Sarah',
        category: 'Office Supplies',
        status: 'Waiting Approval',
        amount: 'EUR 15',
        description: 'Laptop accessories',
        date: '6th Oct, 2025',
        remarks: 'New mouse and keyboard for workstation'
    },
    {
        id: 4,
        approvalSubject: 'none',
        paidBy: 'John Smith',
        category: 'Software',
        status: 'Waiting Approval',
        amount: 'GBP 50',
        description: 'Annual software subscription',
        date: '5th Oct, 2025',
        remarks: 'Productivity tools license renewal'
    },
    {
        id: 5,
        approvalSubject: 'none',
        paidBy: 'Emily Wilson',
        category: 'Training',
        status: 'Waiting Approval',
        amount: 'AUD 200',
        description: 'Online course registration',
        date: '4th Oct, 2025',
        remarks: 'Professional development - React certification'
    }
];
