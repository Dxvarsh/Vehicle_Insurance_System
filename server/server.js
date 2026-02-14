import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

// Config
import config from './config/env.js';
import connectDB from './config/db.js';

// Middleware
import errorHandler from './middleware/errorHandler.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';

// Future route imports will go here

const app = express();

// ─────────────────────────────────────────────
// Security Middleware
// ─────────────────────────────────────────────
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);

// Stricter rate limit for auth routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again later.',
    },
});
app.use('/api/auth/', authLimiter);

// ─────────────────────────────────────────────
// Core Middleware
// ─────────────────────────────────────────────
app.use(cors({
    origin: config.clientUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Logging (only in development)
if (config.nodeEnv === 'development') {
    app.use(morgan('dev'));
}

// ─────────────────────────────────────────────
// API Routes
// ─────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/vehicles', vehicleRoutes);

// Future routes:
// app.use('/api/policies', policyRoutes);
// app.use('/api/premiums', premiumRoutes);
// app.use('/api/renewals', renewalRoutes);
// app.use('/api/claims', claimRoutes);
// app.use('/api/notifications', notificationRoutes);
// app.use('/api/dashboard', dashboardRoutes);
// app.use('/api/reports', reportRoutes);

// ─────────────────────────────────────────────
// Health Check
// ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Vehicle Insurance Management System API is running',
        environment: config.nodeEnv,
        timestamp: new Date().toISOString(),
    });
});

// ─────────────────────────────────────────────
// 404 Handler (Express v5 compatible)
// ─────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
    });
});

// ─────────────────────────────────────────────
// Global Error Handler
// ─────────────────────────────────────────────
app.use(errorHandler);

// ─────────────────────────────────────────────
// Start Server
// ─────────────────────────────────────────────
const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        app.listen(config.port, () => {
            console.log('═══════════════════════════════════════════════');
            console.log('  🚗 Vehicle Insurance Management System API');
            console.log('═══════════════════════════════════════════════');
            console.log(`  🌐 Environment : ${config.nodeEnv}`);
            console.log(`  🚀 Server      : http://localhost:${config.port}`);
            console.log(`  📡 API Base    : http://localhost:${config.port}/api`);
            console.log(`  ❤️  Health      : http://localhost:${config.port}/api/health`);
            console.log('═══════════════════════════════════════════════');
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();
export default app;