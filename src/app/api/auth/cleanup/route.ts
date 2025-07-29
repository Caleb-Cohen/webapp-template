import { cleanupExpiredSessions } from '@/lib/session';

export async function POST() {
  try {
    await cleanupExpiredSessions();
    return Response.json({
      success: true,
      message: 'Expired sessions cleaned up',
    });
  } catch (_error) {
    return Response.json(
      { success: false, error: 'Cleanup failed' },
      { status: 500 },
    );
  }
}
