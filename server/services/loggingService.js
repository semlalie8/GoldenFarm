import winston from 'winston';
import 'winston-daily-rotate-file';

// Define Log Levels according to Syslog
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
};

// Define Log Colors
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue'
};

winston.addColors(levels);

// Custom Filter to scrub sensitive data (PII)
const piiFilter = winston.format((info) => {
    if (info.message && typeof info.message === 'string') {
        info.message = info.message
            .replace(/password=.+?(?=\s|$)/g, 'password=[REDACTED]')
            .replace(/token=.+?(?=\s|$)/g, 'token=[REDACTED]')
            .replace(/email=.+?(?=\s|$)/g, 'email=[REDACTED]');
    }
    return info;
});

// Configure Transports
const transports = [
    // 1. Console Transport (For Dev/Docker Logs)
    new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize({ all: true }),
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.printf(info => `${info.timestamp} [${info.level}]: ${info.message}`)
        )
    }),

    // 2. Daily Rotate File (For Persistence)
    new winston.transports.DailyRotateFile({
        filename: 'logs/application-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        level: 'info',
        format: winston.format.combine(
            piiFilter(),
            winston.format.timestamp(),
            winston.format.json()
        )
    }),

    // 3. Error Log
    new winston.transports.DailyRotateFile({
        filename: 'logs/error-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '30d',
        level: 'error',
        format: winston.format.combine(
            piiFilter(),
            winston.format.timestamp(),
            winston.format.json()
        )
    })
];

const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    levels,
    transports
});

/**
 * Express Middleware for HTTP Logging
 */
export const httpLogger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const ms = Date.now() - start;
        logger.http(`${req.method} ${req.originalUrl} ${res.statusCode} - ${ms}ms [IP: ${req.ip}]`);
    });
    next();
};

export default logger;
