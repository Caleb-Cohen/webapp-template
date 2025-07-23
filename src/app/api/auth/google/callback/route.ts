import { google } from '@/lib/auth';
import {
  createSession,
  setSessionTokenCookie,
  verifyRequestOrigin,
} from '@/lib/session';
import { createUser, getUserFromGoogleId } from '@/lib/user';
import { GoogleIdTokenClaims } from '@/types/auth';
import { decodeIdToken } from 'arctic';
import { cookies } from 'next/headers';

import type { OAuth2Tokens } from 'arctic';

export async function GET(request: Request): Promise<Response> {
  const origin = request.headers.get('origin');
  if (!verifyRequestOrigin(request.method, origin || '')) {
    return new Response(null, {
      status: 403,
    });
  }
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const cookieStore = await cookies();
  const storedState = cookieStore.get('google_oauth_state')?.value ?? null;
  const codeVerifier = cookieStore.get('google_code_verifier')?.value ?? null;
  if (
    code === null ||
    state === null ||
    storedState === null ||
    codeVerifier === null
  ) {
    return new Response(null, {
      status: 400,
    });
  }
  if (state !== storedState) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/login?error=state_mismatch',
      },
    });
  }

  let tokens: OAuth2Tokens;
  try {
    tokens = await google.validateAuthorizationCode(code, codeVerifier);
  } catch (_e) {
    return new Response(null, {
      status: 400,
    });
  }
  const claims = decodeIdToken(tokens.idToken()) as GoogleIdTokenClaims;
  const googleUserId = claims.sub;
  const username = claims.name;

  // TODO: Replace this with your own DB query.
  const existingUser = await getUserFromGoogleId(googleUserId);

  if (existingUser !== null) {
    const session = await createSession(existingUser.id);
    await setSessionTokenCookie(session.token, session.expiresAt);
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/',
      },
    });
  }

  // TODO: Replace this with your own DB query.
  const user = await createUser(googleUserId, username);

  const session = await createSession(user.id);
  await setSessionTokenCookie(session.token, session.expiresAt);
  return new Response(null, {
    status: 302,
    headers: {
      Location: '/',
    },
  });
}
