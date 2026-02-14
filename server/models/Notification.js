import mongoose from 'mongoose';
import Counter from './Counter.js';

const notificationSchema = new mongoose.Schema(
    {
        notificationID: {
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
            default: null,
        },
        messageType: {
            type: String,
            enum: {
                values: ['Expiry', 'Renewal', 'Claim-Update', 'Payment', 'General'],
                message: '{VALUE} is not a valid message type',
            },
            required: [true, 'Message type is required'],
        },
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },
        message: {
            type: String,
            required: [true, 'Message is required'],
            trim: true,
        },
        sentDate: {
            type: Date,
            default: Date.now,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        deliveryStatus: {
            type: String,
            enum: {
                values: ['Sent', 'Delivered', 'Failed'],
                message: '{VALUE} is not a valid delivery status',
            },
            default: 'Sent',
        },
    },
    {
        timestamps: true,
    }
);

notificationSchema.index({ customerID: 1, isRead: 1 });
notificationSchema.index({ messageType: 1 });
notificationSchema.index({ sentDate: -1 });

// Auto-generate notificationID
notificationSchema.pre('save', async function () {
    if (this.isNew) {
        const seq = await Counter.getNextSequence('notificationID');
        this.notificationID = `NOTIF-${String(seq).padStart(5, '0')}`;
    }
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;