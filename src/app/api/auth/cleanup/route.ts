import { logger } from '@/lib/logger';
import { cleanupExpiredSessions } from '@/lib/session';

export async function POST() {
  try {
    await cleanupExpiredSessions();
    return Response.json({
      success: true,
      message: 'Expired sessions cleaned up',
    });
  } catch (error) {
    logger.error('Error cleaning up expired sessions', {
      message: error instanceof Error ? error.message : 'Unknown error',
    });
    return Response.json(
      { success: false, error: 'Cleanup failed' },
      { status: 500 },
    );
  }
}
