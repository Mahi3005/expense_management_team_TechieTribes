const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a company name'],
        trim: true,
        unique: true
    },
    country: {
        type: String,
        required: [true, 'Please provide a country'],
        trim: true
    },
    currency: {
        type: String,
        required: [true, 'Please provide a currency'],
        default: 'USD',
        trim: true,
        uppercase: true
    },
    currencySymbol: {
        type: String,
        default: '$'
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    },
    settings: {
        dateFormat: {
            type: String,
            default: 'MM/DD/YYYY'
        },
        timezone: {
            type: String,
            default: 'UTC'
        }
    }
}, {
    timestamps: true
});

// Index for faster queries
companySchema.index({ adminId: 1 });
companySchema.index({ isActive: 1 });

module.exports = mongoose.model('Company', companySchema);
