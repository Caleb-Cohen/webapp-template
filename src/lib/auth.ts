import { Google } from 'arctic';
import logger from './logger';

let googleClient: Google | null = null;

export function getGoogleClient(): Google {
  if (googleClient) return googleClient;

  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } =
    process.env;
  if (!GOOGLE_CLIENT_ID) {
    logger.warn('GOOGLE_CLIENT_ID environment variable is not set');
    throw new Error('GOOGLE_CLIENT_ID environment variable is not set');
  }
  if (!GOOGLE_CLIENT_SECRET) {
    logger.warn('GOOGLE_CLIENT_SECRET environment variable is not set');
    throw new Error('GOOGLE_CLIENT_SECRET environment variable is not set');
  }
  if (!GOOGLE_REDIRECT_URI) {
    logger.warn('GOOGLE_REDIRECT_URI environment variable is not set');
    throw new Error('GOOGLE_REDIRECT_URI environment variable is not set');
  }

  googleClient = new Google(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI,
  );
  return googleClient;
}
