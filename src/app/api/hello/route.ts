import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await db.$connect();

    return NextResponse.json({
      message: 'Hello, world!',
      database: 'connected',
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Hello, world!',
        database: 'disconnected',
        error: error,
      },
      { status: 200 },
    );
  }
}
