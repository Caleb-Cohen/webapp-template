import { EnvSchema } from './env.schema';

const baseValidEnv = {
  NODE_ENV: 'development',
  LOG_LEVEL: 'info',
  DATABASE_URL: 'https://db.example.com',
  REDIS_URL: 'redis://localhost:6379/0',
  GOOGLE_CLIENT_ID: 'id',
  GOOGLE_CLIENT_SECRET: 'secret',
  GOOGLE_REDIRECT_URI: 'https://example.com/callback',
  DEEP_CHECK_TOKEN: 'abcdefghijklmnop',
};

describe('EnvSchema', () => {
  test('accepts a valid environment', () => {
    const parsed = EnvSchema.safeParse(baseValidEnv);
    expect(parsed.success).toBe(true);
  });

  test('fails when REDIS_URL does not start with redis://', () => {
    const parsed = EnvSchema.safeParse({
      ...baseValidEnv,
      REDIS_URL: 'rediss://localhost:6379',
    });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      const issue = parsed.error.issues.find(
        i => i.path.join('.') === 'REDIS_URL',
      );
      expect(issue?.message).toBe('REDIS_URL must start with redis://');
    }
  });

  test('fails when DATABASE_URL is not a valid URL', () => {
    const parsed = EnvSchema.safeParse({
      ...baseValidEnv,
      DATABASE_URL: 'not-a-url',
    });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      const issue = parsed.error.issues.find(
        i => i.path.join('.') === 'DATABASE_URL',
      );
      expect(issue?.message).toBe('DATABASE_URL must be a valid URL');
    }
  });

  test('fails when DEEP_CHECK_TOKEN is too short', () => {
    const parsed = EnvSchema.safeParse({
      ...baseValidEnv,
      DEEP_CHECK_TOKEN: 'short',
    });
    expect(parsed.success).toBe(false);
  });
});
