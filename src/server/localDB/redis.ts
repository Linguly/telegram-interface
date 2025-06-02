import Redis from 'ioredis';

const redis = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD,
    tls: process.env.REDIS_TLS === 'true' ? {} : undefined, // Enable TLS if needed
    enableReadyCheck: true,
});
redis.on('ready', () => {
    console.log('Redis connection established successfully.');
});
redis.on('error', (err) => {
    console.error('Redis connection error:', err);
});

export default redis;