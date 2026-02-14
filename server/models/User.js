import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import config from '../config/env.js';
import Counter from './Counter.js';

const userSchema = new mongoose.Schema(
    {
        userID: {
            type: String,
            unique: true,
        },
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true,
            trim: true,
            minlength: [3, 'Username must be at least 3 characters'],
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
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be at least 8 characters'],
            select: false,
        },
        role: {
            type: String,
            enum: {
                values: ['Admin', 'Staff', 'Customer'],
                message: '{VALUE} is not a valid role',
            },
            required: [true, 'Role is required'],
            default: 'Customer',
        },
        linkedCustomerID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
            default: null,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        refreshToken: {
            type: String,
            select: false,
        },
        passwordResetToken: {
            type: String,
            select: false,
        },
        passwordResetExpires: {
            type: Date,
            select: false,
        },
        emailVerified: {
            type: Boolean,
            default: false,
        },
        emailVerificationToken: {
            type: String,
            select: false,
        },
        lastLogin: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// ✅ Only add indexes for fields that DON'T already have `unique: true`
// unique: true already creates an index, so we skip email, username, userID
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

// Auto-generate userID before saving
userSchema.pre('save', async function () {
    if (this.isNew) {
        const seq = await Counter.getNextSequence('userID');
        this.userID = `USR-${String(seq).padStart(5, '0')}`;
    }
});

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(config.bcryptSaltRounds);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Remove sensitive fields when converting to JSON
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    delete user.refreshToken;
    delete user.passwordResetToken;
    delete user.passwordResetExpires;
    delete user.emailVerificationToken;
    delete user.__v;
    return user;
};

const User = mongoose.model('User', userSchema);

export default User;