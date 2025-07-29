import { GET as logoutHandler } from '@/app/api/auth/logout/route';
import { deleteSession } from '@/lib/session';
import { cookies as cookiesMock } from 'next/headers';
import { redirect as redirectMock } from 'next/navigation';

jest.mock('@/lib/session', () => ({
  deleteSession: jest.fn(),
}));

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

const setupMockCookies = (sessionToken: string | null) => {
  (cookiesMock as jest.Mock).mockReturnValue({
    get: jest.fn((name: string) => {
      if (name === 'session_token' && sessionToken) {
        return { value: sessionToken };
      }
      return undefined;
    }),
    set: jest.fn(),
  });
};

describe('GET /api/auth/logout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('calls deleteSession and clears cookie when session token exists', async () => {
    setupMockCookies('abc123.def456');

    await logoutHandler();

    expect(deleteSession).toHaveBeenCalledWith('abc123');
    const cookieStore = (cookiesMock as jest.Mock).mock.results[0].value;
    expect(cookieStore.set).toHaveBeenCalledWith(
      'session_token',
      '',
      expect.objectContaining({
        httpOnly: true,
        secure: expect.any(Boolean),
        sameSite: 'lax',
        path: '/',
        expires: expect.any(Date),
      }),
    );
    expect(redirectMock).toHaveBeenCalledWith('/');
  });

  test('clears cookie and redirects even if no session token', async () => {
    setupMockCookies(null);

    await logoutHandler();

    expect(deleteSession).not.toHaveBeenCalled();
    const cookieStore = (cookiesMock as jest.Mock).mock.results[0].value;
    expect(cookieStore.set).toHaveBeenCalledWith(
      'session_token',
      '',
      expect.objectContaining({
        expires: expect.any(Date),
      }),
    );
    expect(redirectMock).toHaveBeenCalledWith('/');
  });
});
