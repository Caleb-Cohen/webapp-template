import { db } from '@/lib/db';
import { createSession, validateSessionToken } from '@/lib/session';
import { createUser } from '@/lib/user';

describe('Session Integration Tests', () => {
  test('creates session with correct expiration', async () => {
    const googleId = `test_google_${Date.now()}_${Math.random()}`;
    const user = await createUser(googleId, 'Sam Smith');
    const session = await createSession(user.id);
    expect(session.expiresAt.getTime()).toBeGreaterThan(Date.now());
    expect(session.userId).toBe(user.id);
  });

  test('validates valid session token', async () => {
    const googleId = `test_google_${Date.now()}_${Math.random()}`;
    const user = await createUser(googleId, 'Sam Smith');
    const session = await createSession(user.id);
    const validated = await validateSessionToken(session.token);
    expect(validated).toBeTruthy();
    expect(validated?.id).toBe(session.id);
  });

  test('rejects tampered session token', async () => {
    const googleId = `test_google_${Date.now()}_${Math.random()}`;
    const user = await createUser(googleId, 'Jane Smith');
    const session = await createSession(user.id);
    const tamperedToken = session.token.slice(0, -1) + 'Z';
    const result = await validateSessionToken(tamperedToken);
    expect(result).toBeNull();
  });

  test('creates multiple sessions for same user', async () => {
    const googleId = `test_google_${Date.now()}_${Math.random()}`;
    const user = await createUser(googleId, 'Katherine Johnson');
    const session1 = await createSession(user.id);
    const session2 = await createSession(user.id);

    expect(session1.id).not.toBe(session2.id);
    expect(session1.token).not.toBe(session2.token);
    expect(session1.userId).toBe(user.id);
    expect(session2.userId).toBe(user.id);
  });

  test('creates session with correct expiration', async () => {
    const googleId = `test_google_${Date.now()}_${Math.random()}`;
    const user = await createUser(googleId, 'Sam Smith');

    const session = await createSession(user.id);

    const sessionInDb = await db.session.findUnique({
      where: { id: session.id },
    });

    expect(sessionInDb).toBeDefined();
    expect(sessionInDb?.expiresAt).toBeDefined();
    expect(sessionInDb?.userId).toBe(user.id);
  });

  test('deleted users delete their sessions', async () => {
    const googleId = `test_google_${Date.now()}_${Math.random()}`;
    const user = await createUser(googleId, 'Nick Cages');
    const session = await createSession(user.id);

    const sessionInDb = await db.session.findUnique({
      where: { id: session.id },
    });
    expect(sessionInDb).toBeDefined();

    await db.user.delete({ where: { id: user.id } });

    const sessionInDb2 = await db.session.findUnique({
      where: { id: session.id },
    });

    expect(sessionInDb2).toBeNull();
  });

  test('deleting sessions should not delete users', async () => {
    const googleId = `test_google_${Date.now()}_${Math.random()}`;
    const user = await createUser(googleId, 'Sabrina Carpenter');
    const session = await createSession(user.id);

    await db.session.delete({ where: { id: session.id } });

    const userInDb = await db.user.findUnique({ where: { id: user.id } });
    expect(userInDb).toBeDefined();
  });
});
