import { db } from '@/lib/db';
import { cleanupExpiredSessions } from '@/lib/session';
import { generateSecureRandomString, validateSessionToken } from './session';

jest.mock('@/lib/db', () => ({
  db: {
    session: {
      deleteMany: jest.fn(),
    },
  },
}));

describe('Session Management', () => {
  test('rejects invalid session token format', async () => {
    const result = await validateSessionToken('invalid-token');
    expect(result).toBeNull();
  });

  test('generates secure random strings', () => {
    const str1 = generateSecureRandomString();
    const str2 = generateSecureRandomString();
    expect(str1).toHaveLength(24);
    expect(str2).toHaveLength(24);
    expect(str1).not.toBe(str2);
  });

  test('cleanup expired sessions', async () => {});

  describe('cleanupExpiredSessions', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('calls deleteMany with expiration filter', async () => {
      await cleanupExpiredSessions();

      expect(db.session.deleteMany).toHaveBeenCalledWith({
        where: {
          expiresAt: {
            lt: expect.any(Date),
          },
        },
      });
    });

    test('handles database errors gracefully', async () => {
      (db.session.deleteMany as jest.Mock).mockRejectedValue(
        new Error('DB error'),
      );

      await expect(cleanupExpiredSessions()).rejects.toThrow('DB error');
    });
  });
});
