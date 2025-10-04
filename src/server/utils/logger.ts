import pino from 'pino';

const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    redact: {
        paths: [
            'err.config.headers.Authorization',
            'err.config.data',
            // Add more paths as needed
        ],
        censor: '[MASKED]' // what to show instead of the real value
    },
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,       // adds color
            translateTime: 'SYS:standard', // human-readable time
            singleLine: false,    // multiline output (default)
            ignore: 'pid,hostname' // removes clutter. Optionally remove ',hostname' to add hostname too
        }
    },
    formatters: {
        level(label) {
            return { level: label };
        },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
});

export default logger;