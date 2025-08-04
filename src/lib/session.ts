import { db } from '@/lib/db';
import { Session, SessionWithToken } from '@/types/auth';
import { createHash } from 'crypto';
import { cookies } from 'next/headers';

export function generateSecureRandomString(): string {
  // Human readable alphabet (a-z, 0-9 without l, o, 0, 1 to avoid confusion)
  const alphabet = 'abcdefghijkmnpqrstuvwxyz23456789';

  // Generate 24 bytes = 192 bits of entropy.
  // We're only going to use 5 bits per byte so the total entropy will be 192 * 5 / 8 = 120 bits
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);

  let id = '';
  for (let i = 0; i < bytes.length; i++) {
    // >> 3 "removes" the right-most 3 bits of the byte
    id += alphabet[bytes[i] >> 3];
  }
  return id;
}

export async function createSession(userId: string): Promise<SessionWithToken> {
  const now = new Date();
  const expiresAt = new Date(now);
  expiresAt.setDate(expiresAt.getDate() + 1);

  const id = generateSecureRandomString();
  const secret = generateSecureRandomString();
  const secretHash = hashSecret(secret);

  const token = id + '.' + secret;

  const session: SessionWithToken = {
    id,
    secretHash,
    createdAt: now,
    expiresAt,
    userId,
    token,
  };

  await db.session.create({
    data: {
      id: session.id,
      secretHash: Buffer.from(session.secretHash),
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
      userId: userId,
    },
  });

  return session;
}

export async function validateSessionToken(
  token: string,
): Promise<Session | null> {
  const tokenParts = token.split('.');
  if (tokenParts.length !== 2) {
    return null;
  }
  const sessionId = tokenParts[0];
  const sessionSecret = tokenParts[1];

  const session = await getSession(sessionId);
  if (!session) {
    return null;
  }

  const tokenSecretHash = hashSecret(sessionSecret);
  const validSecret = constantTimeEqual(tokenSecretHash, session.secretHash);
  if (!validSecret) {
    return null;
  }

  return session;
}

export async function setSessionTokenCookie(
  sessionToken: string,
  expiresAt: Date,
): Promise<boolean> {
  try {
    const cookieStore = await cookies();

    cookieStore.set('session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: expiresAt,
    });

    return true;
  } catch (_error) {
    return false;
  }
}

export async function getSession(sessionId: string): Promise<Session | null> {
  const now = new Date();

  const sessionData = await db.session.findUnique({
    where: { id: sessionId },
  });

  if (!sessionData) {
    return null;
  }

  const session: Session = {
    id: sessionData.id,
    secretHash: new Uint8Array(sessionData.secretHash),
    createdAt: sessionData.createdAt,
    expiresAt: sessionData.expiresAt,
    userId: sessionData.userId,
  };

  if (now.getTime() >= session.expiresAt.getTime()) {
    await deleteSession(sessionId);
    return null;
  }

  return session;
}

export async function deleteSession(sessionId: string): Promise<void> {
  await db.session.delete({
    where: { id: sessionId },
  });
}

export async function cleanupExpiredSessions(): Promise<void> {
  const now = new Date();

  await db.session.deleteMany({
    where: {
      expiresAt: {
        lt: now,
      },
    },
  });
}

export function hashSecret(secret: string): Uint8Array {
  const hash = createHash('sha256');
  hash.update(secret, 'utf8');
  return new Uint8Array(hash.digest());
}

export function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.byteLength !== b.byteLength) {
    return false;
  }
  let c = 0;
  for (let i = 0; i < a.byteLength; i++) {
    c |= a[i] ^ b[i];
  }
  return c === 0;
}

export function encodeSessionPublicJSON(session: Session): string {
  const json = JSON.stringify({
    id: session.id,
    createdAt: Math.floor(session.createdAt.getTime() / 1000),
  });
  return json;
}

export function verifyRequestOrigin(
  method: string,
  originHeader: string,
): boolean {
  if (process.env.NODE_ENV !== 'production') {
    return true;
  }
  if (method === 'GET' || method === 'HEAD') {
    return true;
  }

  if (!process.env.ALLOWED_ORIGINS) {
    return false;
  }

  const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');

  return allowedOrigins.includes(originHeader);
}
