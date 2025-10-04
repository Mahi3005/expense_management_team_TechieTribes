const mongoose = require('mongoose');

const approvalRuleSchema = new mongoose.Schema({
    level: {
        type: Number,
        required: true,
        min: 1
    },
    approver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    approverName: String,
    approverRole: String,
    required: {
        type: Boolean,
        default: true
    },
    description: String,
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const approvalConfigSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
        unique: true
    },
    isManagerApprover: {
        type: Boolean,
        default: true
    },
    approvalSequence: {
        type: Boolean,
        default: true
    },
    minApprovalPercentage: {
        type: Number,
        default: 60,
        min: 0,
        max: 100
    },
    conditionalRules: {
        percentageRule: {
            type: Boolean,
            default: true
        },
        specificApproverRule: {
            type: Boolean,
            default: false
        },
        hybridRule: {
            type: Boolean,
            default: false
        }
    },
    approvalRules: [approvalRuleSchema],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ApprovalConfig', approvalConfigSchema);
