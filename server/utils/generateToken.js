import jwt from 'jsonwebtoken';
import config from '../config/env.js';

export const generateAccessToken = (userId, role) => {
    return jwt.sign(
        { id: userId, role },
        config.jwtSecret,
        { expiresIn: config.jwtAccessExpiry }
    );
};

export const generateRefreshToken = (userId) => {
    return jwt.sign(
        { id: userId },
        config.jwtRefreshSecret,
        { expiresIn: config.jwtRefreshExpiry }
    );
};

export const verifyAccessToken = (token) => {
    return jwt.verify(token, config.jwtSecret);
};

export const verifyRefreshToken = (token) => {
    return jwt.verify(token, config.jwtRefreshSecret);
};