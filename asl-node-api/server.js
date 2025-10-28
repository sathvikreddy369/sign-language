require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const axios = require('axios');
const User = require('./models/User');
const PredictionLog = require('./models/PredictionLog');

const app = express();

// Configuration
const PORT = parseInt(process.env.PORT || '4000', 10);
const JWT_SECRET = process.env.JWT_SECRET || 'change-me';
const PREDICTOR_URL = process.env.PREDICTOR_URL || 'http://localhost:5001';

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/signlang';
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log(`🔗 Connected to MongoDB at ${MONGODB_URI}`))
    .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(cors({
    origin: true, // Allow all origins in development
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Add request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

console.log(`🚀 ASL Node API starting on port ${PORT}`);
console.log(`🔗 Predictor URL: ${PREDICTOR_URL}`);

// Middleware to authenticate JWT
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Access token not found'
        });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                error: 'Invalid token'
            });
        }
        req.user = user;
        next();
    });
}

// Registration endpoint (both /register and /signup for compatibility)
app.post('/api/auth/register', async (req, res) => {
    console.log('Registration attempt:', { email: req.body?.email, hasPassword: !!req.body?.password });
    try {
        const { email, password, role = 'user' } = req.body;

        if (!email || !password) {
            console.log('Missing email or password');
            return res.status(400).json({ 
                success: false, 
                error: 'Email and password are required' 
            });
        }

        // Check if user already exists
        const existing = await User.findOne({ email: email.toLowerCase() }).exec();
        if (existing) {
            return res.status(409).json({ 
                success: false, 
                error: 'Email already registered' 
            });
        }

        // First user becomes admin
        const userCount = await User.countDocuments();
        const userRole = userCount === 0 ? 'admin' : role;

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create and save user
        const userDoc = new User({ 
            email: email.toLowerCase(), 
            password_hash: hashedPassword, 
            role: userRole,
            last_activity_at: new Date()
        });
        await userDoc.save();

        const user = { 
            id: userDoc._id.toString(), 
            email: userDoc.email, 
            role: userDoc.role,
            active: userDoc.active,
            blocked: userDoc.blocked
        };

        res.status(201).json({ 
            success: true, 
            user 
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Registration failed',
            details: error.message 
        });
    }
});

// Signup endpoint (alias for register)
app.post('/api/auth/signup', async (req, res) => {
    console.log('Signup attempt:', { email: req.body?.email, hasPassword: !!req.body?.password });
    try {
        const { email, password, role = 'user' } = req.body;

        if (!email || !password) {
            console.log('Missing email or password');
            return res.status(400).json({ 
                success: false, 
                error: 'Email and password are required' 
            });
        }

        // Check if user already exists
        const existing = await User.findOne({ email: email.toLowerCase() }).exec();
        if (existing) {
            return res.status(409).json({ 
                success: false, 
                error: 'Email already registered' 
            });
        }

        // First user becomes admin
        const userCount = await User.countDocuments();
        const userRole = userCount === 0 ? 'admin' : role;

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create and save user
        const userDoc = new User({ 
            email: email.toLowerCase(), 
            password_hash: hashedPassword, 
            role: userRole,
            last_activity_at: new Date()
        });
        await userDoc.save();

        const user = { 
            id: userDoc._id.toString(), 
            email: userDoc.email, 
            role: userDoc.role,
            active: userDoc.active,
            blocked: userDoc.blocked
        };

        res.status(201).json({ 
            success: true, 
            user 
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Registration failed',
            details: error.message 
        });
    }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
    console.log('Login attempt:', { email: req.body?.email, hasPassword: !!req.body?.password });
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            console.log('Missing email or password');
            return res.status(400).json({ 
                success: false, 
                error: 'Email and password are required' 
            });
        }

        // Check if user exists
        const userDoc = await User.findOne({ email: email.toLowerCase() }).exec();
        if (!userDoc) {
            return res.status(401).json({ 
                success: false, 
                error: 'Invalid credentials' 
            });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, userDoc.password_hash);
        if (!validPassword) {
            return res.status(401).json({ 
                success: false, 
                error: 'Invalid credentials' 
            });
        }

        // Check if account is active
        if (!userDoc.active || userDoc.blocked) {
            return res.status(403).json({ 
                success: false, 
                error: 'Account inactive or blocked' 
            });
        }

        // Update last activity
        userDoc.last_activity_at = new Date();
        await userDoc.save();

        const user = { 
            id: userDoc._id.toString(), 
            email: userDoc.email, 
            role: userDoc.role,
            active: userDoc.active,
            blocked: userDoc.blocked
        };

        // Generate access token
        const accessToken = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({ 
            success: true, 
            access_token: accessToken, 
            user 
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: 'Login failed'
        });
    }
});

// Optional auth middleware for predictions
function optionalAuth(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (!err) {
                req.user = user;
            }
        });
    }
    next();
}

// Prediction endpoint - forwards to Python API
app.post('/api/predict', optionalAuth, async (req, res) => {
    const startTime = Date.now();
    try {
        const { image } = req.body;
        if (!image) {
            return res.status(400).json({ 
                success: false, 
                error: 'No image provided' 
            });
        }

        // Forward to Python predictor API
        const response = await axios.post(`${PREDICTOR_URL}/api/predict`, { image });
        const latency = Date.now() - startTime;

        // Log the prediction
        try {
            const log = new PredictionLog({
                user_id: req.user?.id || null,
                label: response.data.prediction,
                confidence: response.data.confidence,
                latency_ms: latency,
                success: response.data.success,
                client_ip: req.ip || req.connection.remoteAddress,
                top_predictions: response.data.top_predictions
            });
            await log.save();

            // Update user last activity if logged in
            if (req.user?.id) {
                await User.findByIdAndUpdate(req.user.id, { 
                    last_activity_at: new Date() 
                });
            }
        } catch (logError) {
            console.error('Failed to log prediction:', logError);
        }

        res.json({
            ...response.data,
            latency_ms: latency
        });
    } catch (error) {
        console.error('Prediction error:', error);
        const latency = Date.now() - startTime;

        // Log the error
        try {
            const log = new PredictionLog({
                user_id: req.user?.id || null,
                latency_ms: latency,
                success: false,
                error_message: error.message,
                client_ip: req.ip || req.connection.remoteAddress
            });
            await log.save();
        } catch (logError) {
            console.error('Failed to log prediction error:', logError);
        }

        if (error.code === 'ECONNREFUSED') {
            res.status(503).json({ 
                success: false, 
                error: 'Prediction service unavailable' 
            });
        } else {
            res.status(500).json({ 
                success: false, 
                error: 'Prediction failed' 
            });
        }
    }
});

// Batch prediction endpoint
app.post('/api/predict-batch', async (req, res) => {
    try {
        const { images } = req.body;
        if (!Array.isArray(images) || images.length === 0) {
            return res.status(400).json({ 
                success: false, 
                error: 'No images provided' 
            });
        }

        // Forward to Python predictor API
        const response = await axios.post(`${PREDICTOR_URL}/api/predict-batch`, { images });
        res.json(response.data);
    } catch (error) {
        console.error('Batch prediction error:', error);
        if (error.code === 'ECONNREFUSED') {
            res.status(503).json({ 
                success: false, 
                error: 'Prediction service unavailable' 
            });
        } else {
            res.status(500).json({ 
                success: false, 
                error: 'Batch prediction failed' 
            });
        }
    }
});

// Get labels endpoint
app.get('/api/labels', async (req, res) => {
    try {
        // Forward to Python predictor API
        const response = await axios.get(`${PREDICTOR_URL}/api/labels`);
        res.json(response.data);
    } catch (error) {
        console.error('Labels error:', error);
        // Fallback labels if predictor is unavailable
        const fallbackLabels = [
            'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
            'del','nothing','space'
        ];
        res.json({ success: true, labels: fallbackLabels });
    }
});

// Get current user profile
app.get('/api/auth/me', authenticateToken, async (req, res) => {
    try {
        const userId = req.user && req.user.id;
        if (!userId) {
            return res.status(401).json({ 
                success: false, 
                error: 'Unauthorized' 
            });
        }

        const userDoc = await User.findById(userId).exec();
        if (!userDoc) {
            return res.status(404).json({ 
                success: false, 
                error: 'User not found' 
            });
        }

        const user = { 
            id: userDoc._id.toString(), 
            email: userDoc.email, 
            role: userDoc.role, 
            active: userDoc.active, 
            blocked: userDoc.blocked, 
            created_at: userDoc.created_at,
            updated_at: userDoc.updated_at,
            last_activity_at: userDoc.last_activity_at 
        };

        res.json({ success: true, user });
    } catch (err) {
        console.error('Profile error:', err);
        res.status(500).json({ 
            success: false, 
            error: 'Error fetching profile' 
        });
    }
});

// Admin middleware
function requireAdmin(req, res, next) {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({
            success: false,
            error: 'Admin access required'
        });
    }
    next();
}

// Get all users (admin only)
app.get('/api/users', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const users = await User.find({}, '-password_hash')
            .sort({ created_at: -1 })
            .exec();
        
        res.json({ 
            success: true, 
            users: users.map(user => ({
                id: user._id.toString(),
                email: user.email,
                role: user.role,
                active: user.active,
                blocked: user.blocked,
                created_at: user.created_at,
                updated_at: user.updated_at,
                last_activity_at: user.last_activity_at
            }))
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch users' 
        });
    }
});

// Update user (admin only)
app.patch('/api/users/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { active, blocked, role } = req.body;

        const updateData = {};
        if (typeof active === 'boolean') updateData.active = active;
        if (typeof blocked === 'boolean') updateData.blocked = blocked;
        if (role && ['user', 'admin'].includes(role)) updateData.role = role;

        const user = await User.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true, select: '-password_hash' }
        ).exec();

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                error: 'User not found' 
            });
        }

        res.json({ 
            success: true, 
            user: {
                id: user._id.toString(),
                email: user.email,
                role: user.role,
                active: user.active,
                blocked: user.blocked,
                created_at: user.created_at,
                updated_at: user.updated_at,
                last_activity_at: user.last_activity_at
            }
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to update user' 
        });
    }
});

// Get prediction logs
app.get('/api/predictions', authenticateToken, async (req, res) => {
    try {
        const isAdmin = req.user?.role === 'admin';
        const { page = 1, page_size = 25, label, success } = req.query;
        
        const query = {};
        
        // Non-admin users can only see their own logs
        if (!isAdmin) {
            query.user_id = req.user.id;
        }
        
        if (label) query.label = label;
        if (success !== undefined) {
            query.success = success === 'true';
        }

        const limit = Math.min(parseInt(page_size), 100);
        const skip = (parseInt(page) - 1) * limit;

        const [logs, total] = await Promise.all([
            PredictionLog.find(query)
                .populate('user_id', 'email')
                .sort({ timestamp: -1 })
                .limit(limit)
                .skip(skip)
                .exec(),
            PredictionLog.countDocuments(query)
        ]);

        res.json({
            success: true,
            total,
            page: parseInt(page),
            page_size: limit,
            items: logs.map(log => ({
                id: log._id.toString(),
                user_id: log.user_id?._id?.toString(),
                user_email: log.user_id?.email,
                timestamp: log.timestamp,
                label: log.label,
                confidence: log.confidence,
                latency_ms: log.latency_ms,
                success: log.success,
                error_message: log.error_message,
                top_predictions: log.top_predictions
            }))
        });
    } catch (error) {
        console.error('Get predictions error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch predictions' 
        });
    }
});

// Get dashboard stats (admin only)
app.get('/api/stats/summary', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const [
            totalPredictions,
            successfulPredictions,
            avgConfidence,
            totalUsers,
            activeUsers
        ] = await Promise.all([
            PredictionLog.countDocuments(),
            PredictionLog.countDocuments({ success: true }),
            PredictionLog.aggregate([
                { $match: { success: true, confidence: { $exists: true } } },
                { $group: { _id: null, avg: { $avg: '$confidence' } } }
            ]),
            User.countDocuments(),
            User.countDocuments({ 
                last_activity_at: { 
                    $gte: new Date(Date.now() - 15 * 60 * 1000) // Last 15 minutes
                } 
            })
        ]);

        res.json({
            success: true,
            stats: {
                total_predictions: totalPredictions,
                successful_predictions: successfulPredictions,
                average_confidence: avgConfidence[0]?.avg || null,
                total_users: totalUsers,
                active_sessions: activeUsers
            }
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch stats' 
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'healthy',
        model_loaded: !!PREDICTOR_URL,
        predictor_configured: !!PREDICTOR_URL 
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 ASL Node API running on http://localhost:${PORT}`);
    console.log(`📡 Frontend can connect to: http://localhost:${PORT}`);
});