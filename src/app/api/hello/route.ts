import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test database connection
    await db.$connect();

    return NextResponse.json({
      message: 'Hello, world!',
      database: 'connected',
    });
  } catch {
    return NextResponse.json(
      {
        message: 'Hello, world!',
        database: 'disconnected',
      },
      { status: 200 },
    ); // Still return 200 since the API works, just DB is down
  }
}
