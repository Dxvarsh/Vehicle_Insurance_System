import mongoose from 'mongoose';
import Counter from './Counter.js';

const premiumRulesSchema = new mongoose.Schema(
    {
        vehicleTypeMultiplier: {
            type: Map,
            of: Number,
            default: {
                '2-Wheeler': 0.8,
                '4-Wheeler': 1.0,
                'Commercial': 1.5,
            },
        },
        ageDepreciation: {
            type: Number,
            default: 2,
            min: [0, 'Age depreciation cannot be negative'],
        },
        coverageMultiplier: {
            type: Map,
            of: Number,
            default: {
                'Third-Party': 0.6,
                'Comprehensive': 1.0,
                'Own-Damage': 0.8,
            },
        },
    },
    { _id: false }
);

const insurancePolicySchema = new mongoose.Schema(
    {
        policyID: {
            type: String,
            unique: true,
        },
        policyName: {
            type: String,
            required: [true, 'Policy name is required'],
            unique: true,
            trim: true,
        },
        coverageType: {
            type: String,
            enum: {
                values: ['Third-Party', 'Comprehensive', 'Own-Damage'],
                message: '{VALUE} is not a valid coverage type',
            },
            required: [true, 'Coverage type is required'],
        },
        policyDuration: {
            type: Number,
            required: [true, 'Policy duration is required'],
            enum: {
                values: [12, 24, 36],
                message: 'Policy duration must be 12, 24, or 36 months',
            },
        },
        baseAmount: {
            type: Number,
            required: [true, 'Base amount is required'],
            min: [0, 'Base amount cannot be negative'],
        },
        premiumRules: {
            type: premiumRulesSchema,
            default: () => ({}),
        },
        description: {
            type: String,
            trim: true,
            default: '',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Only index non-unique fields
insurancePolicySchema.index({ coverageType: 1 });
insurancePolicySchema.index({ isActive: 1 });
insurancePolicySchema.index({ policyName: 'text' });

// Auto-generate policyID
insurancePolicySchema.pre('save', async function () {
    if (this.isNew) {
        const seq = await Counter.getNextSequence('policyID');
        this.policyID = `POL-${String(seq).padStart(5, '0')}`;
    }
});

const InsurancePolicy = mongoose.model('InsurancePolicy', insurancePolicySchema);

export default InsurancePolicy;