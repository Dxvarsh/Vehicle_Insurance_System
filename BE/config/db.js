import mongoose from 'mongoose';
import config from './env.js';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(config.mongoUri, {
            // Modern mongoose doesn't need most options, but these are useful
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📦 Database: ${conn.connection.name}`);

        // Connection event listeners
        mongoose.connection.on('error', (err) => {
            console.error(`❌ MongoDB connection error: ${err.message}`);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️ MongoDB disconnected');
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('🛑 MongoDB connection closed due to app termination');
            process.exit(0);
        });

        return conn;
    } catch (error) {
        console.error(`❌ MongoDB Connection Failed: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;