import { redis } from './redis';

async function checkRateLimit(
  identifier: string,
  limit: number,
  window: number,
) {
  const key = `rate_limit:${identifier}`;

  const current = await redis.incr(key);
  if (current === 1) {
    await redis.expire(key, window);
  }

  return current <= limit;
}

export default checkRateLimit;
