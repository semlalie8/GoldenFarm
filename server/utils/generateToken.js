import jwt from 'jsonwebtoken';
import RefreshToken from '../models/refreshTokenModel.js';

const generateTokens = async (res, userId, ipAddress = '', userAgent = '') => {
    // 1. Generate short-lived Access Token (15 minutes)
    const accessToken = jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'secret123', {
        expiresIn: '15m',
    });

    // 2. Generate long-lived Refresh Token (7 days)
    const refreshTokenValue = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'secret123', {
        expiresIn: '7d',
    });

    // 3. Persist Refresh Token in Database for monitoring and revocation
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await RefreshToken.create({
        user: userId,
        token: refreshTokenValue,
        expiresAt,
        ipAddress,
        userAgent
    });

    // 4. Set persistent Refresh Token cookie (HTTPOnly, Secure)
    res.cookie('refreshToken', refreshTokenValue, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // 5. Set short-lived Access Token cookie
    res.cookie('jwt', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000, // 15 minutes
    });

    return accessToken;
};

export default generateTokens;
