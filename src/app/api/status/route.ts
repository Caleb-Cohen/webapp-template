import { db } from '@/lib/db';
import { ApiError } from '@/lib/error-handler';
import checkRateLimit from '@/lib/rate-limit';
import { redis } from '@/lib/redis';
import { validateSessionToken } from '@/lib/session';
import { withErrorHandler } from '@/lib/with-error-handler';
import { cookies } from 'next/headers';
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

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session_token')?.value;

  if (!sessionToken) {
    throw ApiError.unauthorized('No session token found');
  }

  const rateLimitOk = await checkRateLimit(sessionToken, 10, 60);
  if (!rateLimitOk) {
    throw ApiError.tooManyRequests('Rate limit exceeded');
  }

  const session = await validateSessionToken(sessionToken);
  if (!session) {
    throw ApiError.unauthorized('Invalid session token');
  }

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
