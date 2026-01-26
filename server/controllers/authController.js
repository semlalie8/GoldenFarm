import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateTokens from '../utils/generateToken.js';
import RefreshToken from '../models/refreshTokenModel.js';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import LoginHistory from '../models/loginHistoryModel.js';
import geoip from 'geoip-lite';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';
import auditService from '../services/auditService.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// HQ Coordinates (Marrakech, Morocco)
const HQ_LAT = 31.6295;
const HQ_LON = -7.9811;

// Helper to calculate distance in km (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password, latitude, longitude } = req.body;

    console.log(`Login attempt for: ${email}`);

    // Find ALL users with this email
    const users = await User.find({ email });
    console.log(`Found ${users.length} users with this email.`);

    let user = null;

    if (users && users.length > 0) {
        // Iterate to find the one with the matching password
        for (const u of users) {
            const isMatch = await u.matchPassword(password);
            console.log(`Checking user ${u.name}: Match? ${isMatch}`);
            if (isMatch) {
                user = u;
                break;
            }
        }
    }

    if (user) {
        const ip = req.ip || req.connection.remoteAddress;
        const ua = req.headers['user-agent'];
        const token = await generateTokens(res, user._id, ip, ua);

        // Record Login History
        try {
            let locationData = {};
            let ip = req.ip || req.connection.remoteAddress;

            // Priority 1: Client-side Geolocation (Precise)
            if (latitude && longitude) {
                console.log('Using client-side geolocation:', latitude, longitude);
                const distance = calculateDistance(HQ_LAT, HQ_LON, latitude, longitude);

                // Reverse Geocoding to get city/country from GPS coordinates
                try {
                    const geoResponse = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
                        {
                            headers: {
                                'User-Agent': 'GoldenFarm/1.0'
                            },
                            signal: AbortSignal.timeout(3000)
                        }
                    );
                    const geoData = await geoResponse.json();

                    if (geoData && geoData.address) {
                        locationData = {
                            city: geoData.address.city || geoData.address.town || geoData.address.village || geoData.address.county || 'Unknown',
                            country: geoData.address.country || 'Unknown',
                            latitude: latitude,
                            longitude: longitude,
                            distanceFromHQ: Math.round(distance)
                        };
                    } else {
                        // Fallback to IP-based city if reverse geocoding fails
                        const geo = geoip.lookup(ip);
                        locationData = {
                            city: geo ? geo.city : 'Unknown',
                            country: geo ? geo.country : 'Unknown',
                            latitude: latitude,
                            longitude: longitude,
                            distanceFromHQ: Math.round(distance)
                        };
                    }
                } catch (err) {
                    console.log('Reverse geocoding failed, using IP fallback:', err.message);
                    // Fallback to IP-based location
                    const geo = geoip.lookup(ip);
                    locationData = {
                        city: geo ? geo.city : 'GPS Location',
                        country: geo ? geo.country : 'Unknown',
                        latitude: latitude,
                        longitude: longitude,
                        distanceFromHQ: Math.round(distance)
                    };
                }
            }
            // Priority 2: IP-based Location (Fallback)
            else {
                // Handle localhost/IPv6 loopback
                if (ip === '::1' || ip === '127.0.0.1' || ip === '::ffff:127.0.0.1') {
                    try {
                        // Fetch public IP to get real location when running locally
                        const response = await fetch('https://api.ipify.org?format=json', { signal: AbortSignal.timeout(3000) });
                        const data = await response.json();
                        if (data.ip) {
                            ip = data.ip;
                        }
                    } catch (err) {
                        console.log('Could not fetch public IP, defaulting to local.');
                    }
                }

                const geo = geoip.lookup(ip);

                if (geo) {
                    const distance = calculateDistance(HQ_LAT, HQ_LON, geo.ll[0], geo.ll[1]);
                    locationData = {
                        city: geo.city,
                        country: geo.country,
                        latitude: geo.ll[0],
                        longitude: geo.ll[1],
                        distanceFromHQ: Math.round(distance)
                    };
                }
            }

            await LoginHistory.create({
                user: user._id,
                ipAddress: ip,
                userAgent: req.headers['user-agent'],
                ...locationData
            });
        } catch (error) {
            console.error('Error logging login history:', error);
        }

        // --- NEW AUDIT LOGGING ---
        await auditService.log({
            user: user._id,
            action: 'LOGIN_SUCCESS',
            module: 'AUTH',
            req
        });
        // -------------------------

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            language: user.language,
            token: token
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, phone, language } = req.body;

    // Password Strength Validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        res.status(400);
        throw new Error('Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.');
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email,
        password,
        phone,
        language: language || 'en'
    });

    if (user) {
        const ip = req.ip || req.connection.remoteAddress;
        const ua = req.headers['user-agent'];
        const token = await generateTokens(res, user._id, ip, ua);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            language: user.language,
            token: token
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = asyncHandler(async (req, res) => {
    const refreshTokenValue = req.cookies.refreshToken;
    if (refreshTokenValue) {
        await RefreshToken.deleteOne({ token: refreshTokenValue });
    }

    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.cookie('refreshToken', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
});

// @desc    Google Auth
// @route   POST /api/auth/google
// @access  Public
const googleAuth = asyncHandler(async (req, res) => {
    const { tokenId } = req.body;

    const ticket = await client.verifyIdToken({
        idToken: tokenId,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, picture, sub } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (user) {
        // If user exists but no googleId, link it
        if (!user.googleId) {
            user.googleId = sub;
            await user.save();
        }
    } else {
        // Create new user
        user = await User.create({
            name,
            email,
            googleId: sub,
            avatar: picture,
            password: Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8), // Dummy password
        });
    }

    const ip = req.ip || req.connection.remoteAddress;
    const ua = req.headers['user-agent'];
    await generateTokens(res, user._id, ip, ua);

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        language: user.language
    });
});

// @desc    Forgot Password
// @route   POST /api/auth/forgotpassword
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set expire (10 minutes)
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    const resetUrl = `http://localhost:5173/resetpassword/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password Reset Token',
            message,
        });

        res.status(200).json({ success: true, data: 'Email sent' });
    } catch (error) {
        console.error(error);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(500);
        throw new Error('Email could not be sent');
    }
});

// @desc    Reset Password
// @route   PUT /api/auth/resetpassword/:resetToken
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
    // Get hashed token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        res.status(400);
        throw new Error('Invalid token');
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
        success: true,
        data: 'Password reset success',
    });
});

// @desc    Refresh Access Token
// @route   POST /api/auth/refresh
// @access  Public
const refreshAccessToken = asyncHandler(async (req, res) => {
    const refreshTokenValue = req.cookies.refreshToken;

    if (!refreshTokenValue) {
        res.status(401);
        throw new Error('Refresh token missing');
    }

    const tokenDoc = await RefreshToken.findOne({ token: refreshTokenValue });

    if (!tokenDoc || tokenDoc.isRevoked) {
        res.status(401);
        throw new Error('Invalid or revoked refresh token');
    }

    try {
        const decoded = jwt.verify(refreshTokenValue, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'secret123');

        // Generate new short-lived Access Token
        const accessToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'secret123', {
            expiresIn: '15m',
        });

        // Set short-lived Access Token cookie
        res.cookie('jwt', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000,
        });

        res.json({ status: 'success', token: accessToken });

    } catch (err) {
        console.error('Refresh token verification failed');
        res.status(401);
        throw new Error('Token verification failed');
    }
});

export {
    authUser,
    registerUser,
    logoutUser,
    googleAuth,
    refreshAccessToken,
    forgotPassword,
    resetPassword,
};
