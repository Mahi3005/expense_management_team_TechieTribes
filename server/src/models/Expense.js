const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    expenseId: {
        type: String,
        unique: true
        // Not required since it's auto-generated in pre-save hook
    },
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    description: {
        type: String,
        required: [true, 'Please provide expense description'],
        trim: true
    },
    amount: {
        type: Number,
        required: [true, 'Please provide amount'],
        min: 0
    },
    currency: {
        type: String,
        required: true,
        default: 'USD'
    },
    category: {
        type: String,
        required: [true, 'Please provide category'],
        enum: ['Food', 'Travel', 'Accommodation', 'Office Supplies', 'Software', 'Training', 'Entertainment', 'Healthcare', 'Utilities', 'Transport', 'Supplies', 'Other']
    },
    expenseDate: {
        type: Date,
        required: [true, 'Please provide expense date']
    },
    paidBy: {
        type: String,
        trim: true,
        default: 'Self'
    },
    remarks: {
        type: String,
        trim: true
    },
    receipt: {
        filename: String,
        path: String,
        mimetype: String,
        size: Number
    },
    status: {
        type: String,
        enum: ['Draft', 'Waiting Approval', 'Approved', 'Rejected', 'Partially Approved'],
        default: 'Draft'
    },
    currentApprovalLevel: {
        type: Number,
        default: 0
    },
    approvalHistory: [{
        approver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        approverName: String,
        action: {
            type: String,
            enum: ['Approved', 'Rejected', 'Pending']
        },
        comment: String,
        timestamp: {
            type: Date,
            default: Date.now
        },
        level: Number
    }],
    // OCR extracted data
    ocrData: {
        merchant: String,
        extractedAmount: Number,
        extractedCurrency: String,
        extractedDate: Date,
        rawText: String,
        confidence: {
            merchant: Number,
            amount: Number,
            date: Number
        }
    }
}, {
    timestamps: true
});

// Generate unique expense ID before saving
expenseSchema.pre('save', async function(next) {
    if (!this.expenseId) {
        try {
            // Generate format: EXP-[COMPANY]-YYYYMMDD-XXXX (e.g., EXP-ACME-20251004-A3F9)
            const Company = require('./Company');
            let companyCode = 'COMP';
            
            if (this.companyId) {
                const company = await Company.findById(this.companyId);
                if (company && company.name) {
                    // Extract first 4 letters of company name or full name if shorter
                    companyCode = company.name
                        .replace(/[^a-zA-Z0-9]/g, '') // Remove special chars
                        .substring(0, 4)
                        .toUpperCase();
                    if (companyCode.length === 0) companyCode = 'COMP';
                }
            }
            
            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const random = Math.random().toString(36).substring(2, 6).toUpperCase();
            
            this.expenseId = `EXP-${companyCode}-${year}${month}${day}-${random}`;
        } catch (error) {
            console.error('Error generating expense ID:', error);
            // Fallback to simple ID if company lookup fails
            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const random = Math.random().toString(36).substring(2, 6).toUpperCase();
            this.expenseId = `EXP-${year}${month}${day}-${random}`;
        }
    }
    next();
});

// Add virtual 'id' field that returns expenseId
expenseSchema.virtual('id').get(function() {
    return this.expenseId;
});

// Ensure virtuals are included in JSON
expenseSchema.set('toJSON', { virtuals: true });
expenseSchema.set('toObject', { virtuals: true });

// Index for faster queries
expenseSchema.index({ employee: 1, status: 1 });
expenseSchema.index({ status: 1, currentApprovalLevel: 1 });
expenseSchema.index({ companyId: 1, status: 1 }); // For company-specific queries
expenseSchema.index({ companyId: 1, employee: 1 }); // For employee expenses by company
// Note: expenseId index already created by unique: true in schema

module.exports = mongoose.model('Expense', expenseSchema);
