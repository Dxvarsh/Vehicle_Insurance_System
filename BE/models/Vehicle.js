import mongoose from 'mongoose';
import Counter from './Counter.js';

const vehicleSchema = new mongoose.Schema(
    {
        vehicleID: {
            type: String,
            unique: true,
        },
        customerID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
            required: [true, 'Customer ID is required'],
        },
        vehicleNumber: {
            type: String,
            required: [true, 'Vehicle number is required'],
            unique: true,
            uppercase: true,
            trim: true,
            match: [
                /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/,
                'Vehicle number must be in valid format (e.g., KA01AB1234)',
            ],
        },
        vehicleType: {
            type: String,
            enum: {
                values: ['2-Wheeler', '4-Wheeler', 'Commercial'],
                message: '{VALUE} is not a valid vehicle type',
            },
            required: [true, 'Vehicle type is required'],
        },
        model: {
            type: String,
            required: [true, 'Vehicle model is required'],
            trim: true,
        },
        registrationYear: {
            type: Number,
            required: [true, 'Registration year is required'],
            min: [1990, 'Registration year must be 1990 or later'],
            max: [new Date().getFullYear(), 'Registration year cannot be in the future'],
        },
    },
    {
        timestamps: true,
    }
);

// Only index non-unique fields
vehicleSchema.index({ customerID: 1 });
vehicleSchema.index({ vehicleType: 1 });

// Auto-generate vehicleID
vehicleSchema.pre('save', async function () {
    if (this.isNew) {
        const seq = await Counter.getNextSequence('vehicleID');
        this.vehicleID = `VEH-${String(seq).padStart(5, '0')}`;
    }
});

// Virtual: calculate vehicle age
vehicleSchema.virtual('vehicleAge').get(function () {
    return new Date().getFullYear() - this.registrationYear;
});

vehicleSchema.set('toJSON', { virtuals: true });
vehicleSchema.set('toObject', { virtuals: true });

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

export default Vehicle;