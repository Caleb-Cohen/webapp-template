import { db } from '@/lib/db';

export async function getUserFromGoogleId(googleId: string) {
  return await db.user.findUnique({
    where: { googleId },
  });
}

export async function createUser(googleId: string, name: string) {
  return await db.user.create({
    data: {
      googleId,
      name,
    },
  });
}
