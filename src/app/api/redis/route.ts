import { ApiError } from '@/lib/error-handler';
import { redis } from '@/lib/redis';
import { withErrorHandler } from '@/lib/with-error-handler';
import { NextResponse } from 'next/server';

async function redisHandler() {
  const pong = await redis.ping();

  if (!pong) {
    throw ApiError.serviceUnavailable('Redis service is not available');
  }
  return NextResponse.json({ status: 'ok', pong });
}

export const GET = withErrorHandler(redisHandler);
