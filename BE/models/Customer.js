import mongoose from 'mongoose';
import Counter from './Counter.js';

const customerSchema = new mongoose.Schema(
    {
        customerID: {
            type: String,
            unique: true,
        },
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters'],
        },
        contactNumber: {
            type: String,
            required: [true, 'Contact number is required'],
            unique: true,
            match: [/^\d{10}$/, 'Contact number must be exactly 10 digits'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                'Please enter a valid email',
            ],
        },
        address: {
            type: String,
            required: [true, 'Address is required'],
            trim: true,
        },
        vehicleIDs: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Vehicle',
            },
        ],
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Only index fields without unique:true
customerSchema.index({ name: 'text' });

// Auto-generate customerID
customerSchema.pre('save', async function () {
    if (this.isNew) {
        const seq = await Counter.getNextSequence('customerID');
        this.customerID = `CUST-${String(seq).padStart(5, '0')}`;
    }
});

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;