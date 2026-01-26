import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { initSocket } from './utils/socket.js';
import connectDB from './config/db.js';
import i18next from 'i18next';
import i18nextMiddleware from 'i18next-http-middleware';
import Backend from 'i18next-fs-backend';
import path from 'path';
import { fileURLToPath } from 'url';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import translationRoutes from './routes/translationRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import campaignRoutes from './routes/campaignRoutes.js';
import crowdfundingRoutes from './routes/crowdfundingRoutes.js';
import marketplaceRoutes from './routes/marketplaceRoutes.js';
import toolRoutes from './routes/toolRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import intelligenceRoutes from './routes/intelligenceRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import productRoutes from './routes/productRoutes.js';
import iotRoutes from './routes/iotRoutes.js';
import sensorRoutes from './routes/sensorRoutes.js';
import crmRoutes from './routes/crmRoutes.js';
import financeRoutes from './routes/financeRoutes.js';
import automationRoutes from './routes/automationRoutes.js';
import marketingRoutes from './routes/marketingRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import hrRoutes from './routes/hrRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import platformRoutes from './routes/platformRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import marketRoutes from './routes/marketRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import compression from 'compression';
import { apiLimiter } from './middleware/securityMiddleware.js';
import visionRoutes from './routes/visionRoutes.js';
import branchingRoutes from './routes/branchingRoutes.js';
import { validateEnvironment } from './utils/startupValidator.js';

// Load env vars
dotenv.config();

// Deployment Optimization: Pre-flight check
validateEnvironment();

// Connect to MongoDB database
connectDB();

const app = express();
const httpServer = createServer(app);

// Socket.io setup
const io = new Server(httpServer, {
    cors: {
        origin: (process.env.CLIENT_URL || "http://localhost:5173").split(','),
        methods: ["GET", "POST"],
        credentials: true
    }
});
initSocket(io);

// Real-time Nervous System (Change Streams)
import changeStreamService from './services/changeStreamService.js';
changeStreamService.start();

// Phase 8: Production Hardening (Queue System)
import queueService from './services/queueService.js';
import { runAgentTaskInternal } from './controllers/automationController.js';
import { processQueuedTask } from './services/orchestrationService.js';

queueService.registerHandler('AI_AGENT_TASK', runAgentTaskInternal);
queueService.registerHandler('ORCHESTRATION_ACTION', async (payload) => {
    await processQueuedTask(payload);
});
queueService.start(10000); // Poll every 10 seconds

// Make io available in routes
app.set('io', io);

// ESM __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// i18next Setup
i18next
    .use(Backend)
    .use(i18nextMiddleware.LanguageDetector)
    .init({
        backend: {
            loadPath: path.join(__dirname, 'locales/{{lng}}/{{ns}}.json'),
            addPath: path.join(__dirname, 'locales/{{lng}}/{{ns}}.missing.json'),
        },
        fallbackLng: 'en',
        preload: ['en', 'fr', 'ar'], // English, French, Arabic
        saveMissing: true,
    });

app.use(i18nextMiddleware.handle(i18next));

import { httpLogger } from './services/loggingService.js';

// ...

// Middleware
// Performance Optimization
app.use(compression());

// Security Audit & Protection
app.use('/api', apiLimiter);

// Observability Layer (PII Scrubbing + JSON Logs)
app.use(httpLogger);

// Standard Body Parsers
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(helmet());
app.use(cors({
    origin: (process.env.CLIENT_URL || "http://localhost:5173").split(','),
    credentials: true
}));

// API Routes - Versioning V1
const v1Router = express.Router();

v1Router.use('/auth', authRoutes);
v1Router.use('/users', userRoutes);
v1Router.use('/projects', projectRoutes);
v1Router.use('/transactions', transactionRoutes);
v1Router.use('/translations', translationRoutes);
v1Router.use('/analytics', analyticsRoutes);
v1Router.use('/campaigns', campaignRoutes);
v1Router.use('/crowdfunding', crowdfundingRoutes);
v1Router.use('/marketplace', marketplaceRoutes);
v1Router.use('/tools', toolRoutes);
v1Router.use('/ai', aiRoutes);
v1Router.use('/intelligence', intelligenceRoutes);
v1Router.use('/content', contentRoutes);
v1Router.use('/products', productRoutes);
v1Router.use('/iot', iotRoutes);
v1Router.use('/crm', crmRoutes);
v1Router.use('/finance', financeRoutes);
v1Router.use('/automation', automationRoutes);
v1Router.use('/marketing', marketingRoutes);
v1Router.use('/inventory', inventoryRoutes);
v1Router.use('/hr', hrRoutes);
v1Router.use('/contact', contactRoutes);
v1Router.use('/platform', platformRoutes);
v1Router.use('/cart', cartRoutes);
v1Router.use('/orders', orderRoutes);
v1Router.use('/market', marketRoutes);
v1Router.use('/reports', reportRoutes);
v1Router.use('/vision', visionRoutes);
v1Router.use('/branching', branchingRoutes);

// Register API Versions
app.use('/api/v1', v1Router);

// Fallback for legacy /api routes (Redirect to v1)
app.use('/api', v1Router);

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Socket.io connection
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Error Handling Middleware - Enterprise Standard Schema
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    const errorResponse = {
        status: 'error',
        code: statusCode,
        message: err.message,
        payload: null,
        timestamp: new Date().toISOString()
    };

    if (process.env.NODE_ENV !== 'production') {
        errorResponse.stack = err.stack;
    }

    res.status(statusCode).json(errorResponse);
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
