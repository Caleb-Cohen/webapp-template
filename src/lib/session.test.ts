import { generateSecureRandomString, validateSessionToken } from './session';

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
});
