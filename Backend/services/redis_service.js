import Redis from 'ioredis';

// Create a new Redis instance
const redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
})

// Redis connection
redisClient.on('connect', () => {
    console.log('Redis connected');
})

export default redisClient;