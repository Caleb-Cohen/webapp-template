import { db } from '@/lib/db';
import { createSession } from '@/lib/session';
import { createUser } from '@/lib/user';

describe('Session Integration Tests', () => {
  test('creates session with correct expiration', async () => {
    const googleId = `test_google_${Date.now()}_${Math.random()}`;
    const user = await createUser(googleId, 'Sam Smith');
    const session = await createSession(user.id);
    expect(session.expiresAt.getTime()).toBeGreaterThan(Date.now());
    expect(session.userId).toBe(user.id);
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
