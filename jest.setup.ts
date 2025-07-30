import '@testing-library/jest-dom';

import { TextDecoder, TextEncoder } from 'util';
import { db } from './src/lib/db';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

beforeAll(async () => {
  await db.$connect();

  await db.user.deleteMany({
    where: {
      OR: [
        { googleId: { startsWith: 'test_' } },
        { id: { startsWith: 'test_' } },
      ],
    },
  });
});

afterAll(async () => {
  try {
    await db.$disconnect();
  } catch (_error) {}
});
