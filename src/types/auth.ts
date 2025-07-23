export interface Session {
  id: string;
  secretHash: Uint8Array; // Uint8Array is a byte array
  createdAt: Date;
  expiresAt: Date;
  userId: string;
}

export interface SessionWithToken extends Session {
  token: string;
}

export interface GoogleIdTokenClaims {
  sub: string;
  name: string;
  email?: string;
  picture?: string;
}
