import { db } from '@/lib/db';
import { ApiError } from '@/lib/error-handler';
import { redis } from '@/lib/redis';
import { withErrorHandler } from '@/lib/with-error-handler';
import { NextRequest, NextResponse } from 'next/server';

function verifyBearerToken(request: NextRequest) {
  const authHeader = request.headers.get('Authorization') || '';
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer') {
    throw ApiError.unauthorized('Invalid authorization scheme');
  }

  if (token !== process.env.DEEP_CHECK_TOKEN) {
    throw ApiError.unauthorized('Invalid deep check token');
  }

  return true;
}

async function apiStatus(request: NextRequest) {
  const deep = request.nextUrl.searchParams.get('deep');
  const uptimeSeconds = Math.floor(process.uptime());
  const timestamp = new Date().toISOString();

  if (deep === '1') {
    const tokenValid = verifyBearerToken(request);
    if (!tokenValid) {
      throw ApiError.unauthorized('Invalid deep check token');
    }

    const dbOk = await db.$queryRaw`SELECT 1`;

    if (!dbOk) {
      throw ApiError.serviceUnavailable('Database is not available');
    }

    const redisOk = await redis.ping();

    if (!redisOk) {
      throw ApiError.serviceUnavailable('Redis is not available');
    }

    return NextResponse.json({
      status: 'ok',
      uptimeSeconds,
      timestamp,
      dbCheck: dbOk,
      redisCheck: redisOk,
    });
  }

  return NextResponse.json({ status: 'ok', uptimeSeconds, timestamp });
}

export const GET = withErrorHandler(apiStatus);
