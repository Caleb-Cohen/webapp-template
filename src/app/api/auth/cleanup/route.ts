import { cleanupExpiredSessions } from '@/lib/session';
import { withErrorHandler } from '@/lib/with-error-handler';
import { NextResponse } from 'next/server';

async function cleanupHandler() {
  await cleanupExpiredSessions();

  return NextResponse.json({
    success: true,
    message: 'Expired sessions cleaned up',
  });
}

export const POST = withErrorHandler(cleanupHandler);
