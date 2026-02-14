import mongoose from 'mongoose';
import Counter from './Counter.js';

const policyRenewalSchema = new mongoose.Schema(
    {
        renewalID: {
            type: String,
            unique: true,
        },
        policyID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'InsurancePolicy',
            required: [true, 'Policy ID is required'],
        },
        premiumID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Premium',
            required: [true, 'Premium ID is required'],
        },
        vehicleID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vehicle',
            required: [true, 'Vehicle ID is required'],
        },
        customerID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
            required: [true, 'Customer ID is required'],
        },
        renewalDate: {
            type: Date,
            required: [true, 'Renewal date is required'],
        },
        expiryDate: {
            type: Date,
            required: [true, 'Expiry date is required'],
        },
        renewalStatus: {
            type: String,
            enum: {
                values: ['Pending', 'Approved', 'Rejected', 'Expired'],
                message: '{VALUE} is not a valid renewal status',
            },
            default: 'Pending',
        },
        reminderSentStatus: {
            type: Boolean,
            default: false,
        },
        reminderSentDate: {
            type: Date,
            default: null,
        },
        adminRemarks: {
            type: String,
            default: null,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// Validation: expiryDate must be after renewalDate
policyRenewalSchema.pre('validate', function () {
    if (this.expiryDate && this.renewalDate) {
        if (this.expiryDate <= this.renewalDate) {
            this.invalidate('expiryDate', 'Expiry date must be after renewal date');
        }
    }
});

policyRenewalSchema.index({ customerID: 1 });
policyRenewalSchema.index({ policyID: 1 });
policyRenewalSchema.index({ renewalStatus: 1 });
policyRenewalSchema.index({ expiryDate: 1 });

// Auto-generate renewalID
policyRenewalSchema.pre('save', async function () {
    if (this.isNew) {
        const seq = await Counter.getNextSequence('renewalID');
        this.renewalID = `REN-${String(seq).padStart(5, '0')}`;
    }
});

const PolicyRenewal = mongoose.model('PolicyRenewal', policyRenewalSchema);

export default PolicyRenewal;