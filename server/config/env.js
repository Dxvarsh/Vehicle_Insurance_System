import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
dotenv.config({ path: path.join(__dirname, '../.env') });

const config = {
    // Server
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 5000,

    // Database
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/vehicle_insurance_db',

    // JWT
    jwtSecret: process.env.JWT_SECRET,
    jwtAccessExpiry: process.env.JWT_ACCESS_EXPIRY || '24h',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    jwtRefreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',

    // Bcrypt
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10,

    // Email
    email: {
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT, 10) || 587,
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },

    // Cloudinary
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET,
    },

    // Client
    clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',

    // Password Reset
    passwordResetExpiry: parseInt(process.env.PASSWORD_RESET_EXPIRY, 10) || 3600000,
};

// Validate critical config
const requiredConfigs = ['jwtSecret', 'jwtRefreshSecret', 'mongoUri'];
for (const key of requiredConfigs) {
    if (!config[key]) {
        console.error(`❌ Missing required config: ${key}`);
        process.exit(1);
    }
}

export default config;