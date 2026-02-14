import mongoose from 'mongoose';
import config from '../config/env.js';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Counter from '../models/Counter.js';

const seedAdmin = async () => {
    try {
        await connectDB();

        console.log('🌱 Starting seeder...');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ role: 'Admin' });

        if (existingAdmin) {
            console.log('⚠️ Admin user already exists:');
            console.log(`   Email: ${existingAdmin.email}`);
            console.log(`   Username: ${existingAdmin.username}`);
            process.exit(0);
        }

        // Create admin user
        const adminUser = await User.create({
            username: 'admin',
            email: 'admin@vehicleinsurance.com',
            password: 'Admin@1234',
            role: 'Admin',
            isActive: true,
            emailVerified: true,
        });

        // Create staff user
        const staffUser = await User.create({
            username: 'staff01',
            email: 'staff@vehicleinsurance.com',
            password: 'Staff@1234',
            role: 'Staff',
            isActive: true,
            emailVerified: true,
        });

        console.log('✅ Seed data created successfully!');
        console.log('');
        console.log('  👤 Admin Account:');
        console.log(`     Email    : ${adminUser.email}`);
        console.log(`     Username : ${adminUser.username}`);
        console.log(`     Password : Admin@1234`);
        console.log(`     UserID   : ${adminUser.userID}`);
        console.log('');
        console.log('  👤 Staff Account:');
        console.log(`     Email    : ${staffUser.email}`);
        console.log(`     Username : ${staffUser.username}`);
        console.log(`     Password : Staff@1234`);
        console.log(`     UserID   : ${staffUser.userID}`);
        console.log('');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeder failed:', error.message);
        process.exit(1);
    }
};

// Handle command line args
const args = process.argv.slice(2);

if (args.includes('--destroy')) {
    const destroyData = async () => {
        try {
            await connectDB();
            await User.deleteMany();
            await Counter.deleteMany();
            console.log('🗑️ All data destroyed!');
            process.exit(0);
        } catch (error) {
            console.error('❌ Destroy failed:', error.message);
            process.exit(1);
        }
    };
    destroyData();
} else {
    seedAdmin();
}