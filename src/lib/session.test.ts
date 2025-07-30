import { db } from '@/lib/db';
import {
  cleanupExpiredSessions,
  createSession,
  encodeSessionPublicJSON,
  generateSecureRandomString,
  hashSecret,
  setSessionTokenCookie,
  validateSessionToken,
} from '@/lib/session';
import { cookies } from 'next/headers';

jest.mock('@/lib/db', () => ({
  db: {
    session: {
      create: jest.fn(),
      deleteMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

jest.mock('next/headers', () => ({
  cookies: jest.fn().mockResolvedValue({
    set: jest.fn(),
  }),
}));

describe('Session Management', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('creates session', async () => {
    const session = await createSession('test-user-id');
    expect(session).toBeDefined();
    expect(session.id).toBeDefined();
    expect(session.secretHash).toBeDefined();
    expect(session.createdAt).toBeDefined();
    expect(session.expiresAt).toBeDefined();
    expect(session.userId).toBe('test-user-id');
  });

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

  test('Hashes secret deterministically', () => {
    const secret = generateSecureRandomString();
    const secretHash = hashSecret(secret);
    const secretHash2 = hashSecret(secret);
    expect(secretHash).toEqual(secretHash2);
  });

  test('Different secrets produce different hashes', () => {
    const secret = generateSecureRandomString();
    const secret2 = generateSecureRandomString();
    const secretHash = hashSecret(secret);
    const secretHash2 = hashSecret(secret2);
    expect(secretHash).not.toEqual(secretHash2);
  });

  test('Hashes has correct properties', () => {
    const secret = generateSecureRandomString();
    const secretHash = hashSecret(secret);
    expect(secretHash.length).toBe(32);
    expect(secretHash).toBeInstanceOf(Uint8Array);
    expect(secretHash.some(byte => byte !== 0)).toBe(true);
  });

  test('validates valid session token with mocked database', async () => {
    const secret = generateSecureRandomString();
    const secretHash = hashSecret(secret);

    (db.session.findUnique as jest.Mock).mockResolvedValue({
      id: 'test-session-id',
      secretHash: secretHash,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 86400000),
      userId: 'test-user-id',
    });

    const result = await validateSessionToken(`test-session-id.${secret}`);

    expect(result).toBeDefined();
    expect(db.session.findUnique).toHaveBeenCalledWith({
      where: { id: 'test-session-id' },
    });
  });

  test('returns null with no session in database', async () => {
    (db.session.findUnique as jest.Mock).mockResolvedValue(null);

    const result = await validateSessionToken('nonexistent-session.anysecret');

    expect(result).toBeNull();
    expect(db.session.findUnique).toHaveBeenCalledWith({
      where: { id: 'nonexistent-session' },
    });
  });

  test('returns null when no session found in database', async () => {
    const secret = generateSecureRandomString();
    const secretHash = hashSecret(secret);
    (db.session.findUnique as jest.Mock).mockResolvedValue({
      id: 'test-session-id',
      secretHash: secretHash,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 86400000),
      userId: 'test-user-id',
    });

    const result = await validateSessionToken(`nonexistent-session.anysecret`);

    expect(result).toBeNull();
    expect(db.session.findUnique).toHaveBeenCalledWith({
      where: { id: 'nonexistent-session' },
    });
  });

  test('returns null when session is expired', async () => {
    const secret = generateSecureRandomString();
    const secretHash = hashSecret(secret);
    (db.session.findUnique as jest.Mock).mockResolvedValue({
      id: 'test-session-id',
      secretHash: secretHash,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() - 86400000),
      userId: 'test-user-id',
    });

    const result = await validateSessionToken(`test-session-id.${secret}`);

    expect(result).toBeNull();
  });

  test('returns null when secret hash mismatches', async () => {
    const secret = generateSecureRandomString();
    const wrongSecretHash = hashSecret('wrong-secret');

    (db.session.findUnique as jest.Mock).mockResolvedValue({
      id: 'test-session-id',
      secretHash: secret,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 86400000),
      userId: 'test-user-id',
    });

    const result = await validateSessionToken(
      `test-session-id.${wrongSecretHash}`,
    );
    expect(result).toBeNull();
  });

  describe('cleanupExpiredSessions', () => {
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

  describe('setSessionTokenCookie', () => {
    const mockCookieStore = {
      set: jest.fn(),
    };

    beforeEach(() => {
      jest.clearAllMocks();
      (cookies as jest.Mock).mockResolvedValue(mockCookieStore);
    });

    test('sets session token cookie', async () => {
      const sessionToken = 'test-session-token';
      const expiresAt = new Date(Date.now() + 86400000);

      await setSessionTokenCookie(sessionToken, expiresAt);

      expect(mockCookieStore.set).toHaveBeenCalledWith(
        'session_token',
        sessionToken,
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          expires: expiresAt,
          path: '/',
        },
      );
    });

    test('returns false when cookie setting fails', async () => {
      mockCookieStore.set.mockImplementation(() => {
        throw new Error('Cookie error');
      });

      const result = await setSessionTokenCookie(
        'test-session-token',
        new Date(Date.now() + 86400000),
      );

      expect(result).toBe(false);
    });

    test('encodeSessionPublicJSON formats session correctly', async () => {
      const session = await createSession('test-user-id');

      const encoded = encodeSessionPublicJSON(session);
      const parsed = JSON.parse(encoded);
      expect(parsed).toHaveProperty('id');
      expect(parsed).toHaveProperty('createdAt');
      expect(typeof parsed.id).toBe('string');
      expect(typeof parsed.createdAt).toBe('number');
    });
  });
});
