import { createUser } from '@/lib/user';

describe('User Integration Tests', () => {
  test('creates unique users with different Google IDs', async () => {
    const googleId1 = `test_google_${Date.now()}_${Math.random()}`;
    const googleId2 = `test_google_${Date.now()}_${Math.random()}`;
    const user1 = await createUser(googleId1, 'Fred Weasley');
    const user2 = await createUser(googleId2, 'George Weasley');

    expect(user1.id).not.toBe(user2.id);
    expect(user1.googleId).not.toBe(user2.googleId);
  });
});
