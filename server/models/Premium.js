import mongoose from 'mongoose';
import Counter from './Counter.js';

const premiumSchema = new mongoose.Schema(
    {
        premiumID: {
            type: String,
            unique: true,
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
        customerID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
            required: [true, 'Customer ID is required'],
        },
        calculatedAmount: {
            type: Number,
            required: [true, 'Calculated amount is required'],
            min: [0, 'Amount cannot be negative'],
        },
        calculationBreakdown: {
            baseAmount: Number,
            vehicleTypeMultiplier: Number,
            coverageMultiplier: Number,
            ageDepreciation: Number,
            finalAmount: Number,
        },
        paymentStatus: {
            type: String,
            enum: {
                values: ['Pending', 'Paid', 'Failed'],
                message: '{VALUE} is not a valid payment status',
            },
            default: 'Pending',
        },
        paymentDate: {
            type: Date,
            default: null,
        },
        transactionID: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

premiumSchema.index({ customerID: 1 });
premiumSchema.index({ policyID: 1 });
premiumSchema.index({ vehicleID: 1 });
premiumSchema.index({ paymentStatus: 1 });

// Auto-generate premiumID
premiumSchema.pre('save', async function () {
    if (this.isNew) {
        const seq = await Counter.getNextSequence('premiumID');
        this.premiumID = `PREM-${String(seq).padStart(5, '0')}`;
    }
});

const Premium = mongoose.model('Premium', premiumSchema);

export default Premium;