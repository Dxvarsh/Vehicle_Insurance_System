import mongoose from 'mongoose';
import Counter from './Counter.js';

const claimSchema = new mongoose.Schema(
    {
        claimID: {
            type: String,
            unique: true,
        },
        customerID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
            required: [true, 'Customer ID is required'],
        },
        policyID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'InsurancePolicy',
            required: [true, 'Policy ID is required'],
        },
        vehicleID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vehicle',
            required: [true, 'Vehicle ID is required'],
        },
        premiumID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Premium',
            required: [true, 'Premium ID is required'],
        },
        claimReason: {
            type: String,
            required: [true, 'Claim reason is required'],
            minlength: [10, 'Claim reason must be at least 10 characters'],
            trim: true,
        },
        supportingDocuments: [
            {
                type: String,
            },
        ],
        claimDate: {
            type: Date,
            default: Date.now,
            required: true,
        },
        claimAmount: {
            type: Number,
            default: null,
            min: [0, 'Claim amount cannot be negative'],
        },
        claimStatus: {
            type: String,
            enum: {
                values: ['Pending', 'Approved', 'Rejected', 'Under-Review'],
                message: '{VALUE} is not a valid claim status',
            },
            default: 'Pending',
        },
        adminRemarks: {
            type: String,
            default: null,
            trim: true,
        },
        processedDate: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

claimSchema.index({ customerID: 1 });
claimSchema.index({ policyID: 1 });
claimSchema.index({ claimStatus: 1 });
claimSchema.index({ claimDate: -1 });

// Auto-generate claimID
claimSchema.pre('save', async function () {
    if (this.isNew) {
        const seq = await Counter.getNextSequence('claimID');
        this.claimID = `CLM-${String(seq).padStart(5, '0')}`;
    }
});

const Claim = mongoose.model('Claim', claimSchema);

export default Claim;