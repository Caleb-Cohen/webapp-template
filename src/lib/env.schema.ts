import { z } from 'zod';

export const EnvSchema = z.object({
  // Core
  NODE_ENV: z.enum(['development', 'production', 'test']),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']),

  // Database
  DATABASE_URL: z.url({ message: 'DATABASE_URL must be a valid URL' }),

  // Redis
  REDIS_URL: z
    .url({ message: 'REDIS_URL must be a valid URL' })
    .refine(v => v.startsWith('redis://'), {
      message: 'REDIS_URL must start with redis://',
    }),

  // Google
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_REDIRECT_URI: z.url(),

  // Deep check token
  DEEP_CHECK_TOKEN: z
    .string()
    .min(16, 'DEEP_CHECK_TOKEN should be at least 16 chars')
    .refine(v => v !== 'changeme', 'DEEP_CHECK_TOKEN must not be "changeme"'),
});
