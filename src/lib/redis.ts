import Redis from 'ioredis';

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

if (!process.env.REDIS_URL) {
  throw new Error('REDIS_URL environment variable is not set');
}

export const redis = globalForRedis.redis ?? new Redis(process.env.REDIS_URL);

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;
