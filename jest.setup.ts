import '@testing-library/jest-dom';

import { TextDecoder, TextEncoder } from 'util';
import { db } from './src/lib/db';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

// Object.defineProperty(global, 'crypto', {
//   value: {
//     subtle: {
//       digest: jest.fn().mockResolvedValue(new ArrayBuffer(32)),
//     },
//     getRandomValues: jest.fn(array => {
//       for (let i = 0; i < array.length; i++) {
//         array[i] = Math.floor(Math.random() * 256);
//       }
//       return array;
//     }),
//   },
// });

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
