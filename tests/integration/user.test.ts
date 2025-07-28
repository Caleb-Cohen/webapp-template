import { createUser, getUserFromGoogleId } from '@/lib/user';

describe('User Integration Tests', () => {
  test('creates new user from Google ID', async () => {
    const googleId = `test_google_${Date.now()}_${Math.random()}`;
    const user = await createUser(googleId, 'John Doe');
    expect(user.googleId).toBe(googleId);
    expect(user.name).toBe('John Doe');
    expect(user.id).toBeDefined();
  });

  test('finds existing user by Google ID', async () => {
    const googleId = `test_google_${Date.now()}_${Math.random()}`;
    const user = await createUser(googleId, 'Jane Smith');
    const found = await getUserFromGoogleId(googleId);
    expect(found?.id).toBe(user.id);
    expect(found?.name).toBe('Jane Smith');
  });

  test('returns null for non-existent user', async () => {
    const found = await getUserFromGoogleId('nonexistent');
    expect(found).toBeNull();
  });

  test('creates unique users with different Google IDs', async () => {
    const googleId1 = `test_google_${Date.now()}_${Math.random()}`;
    const googleId2 = `test_google_${Date.now()}_${Math.random()}`;
    const user1 = await createUser(googleId1, 'Fred Weasley');
    const user2 = await createUser(googleId2, 'George Weasley');

    expect(user1.id).not.toBe(user2.id);
    expect(user1.googleId).not.toBe(user2.googleId);
  });
});
