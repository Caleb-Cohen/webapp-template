import { redis } from '@/lib/redis';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const pong = await redis.ping();
    return NextResponse.json({ status: 'ok', pong });
  } catch {
    return NextResponse.json(
      { status: 'error', message: 'Redis connection failed' },
      { status: 500 },
    );
  }
}
