import { createClient, type RedisClientType } from 'redis';

// Create a new Redis instance

let redisClient: RedisClientType;

export const getRedis = async () => {
    if (redisClient) {
        return redisClient;
    }

    redisClient = createClient({
        url: process.env.REDIS_URL,
    });
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }

    redisClient.on('error', (error: any) => {
        console.error('[Redis] error', error);
    });

    return redisClient;
};
