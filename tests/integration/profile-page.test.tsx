/** @jest-environment jsdom */

import { createSession } from '@/lib/session';
import { createUser } from '@/lib/user';
import { render, screen } from '@testing-library/react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

jest.mock('next/headers');
jest.mock('next/navigation');

const mockCookies = cookies as jest.MockedFunction<typeof cookies>;
const mockRedirect = redirect as jest.MockedFunction<typeof redirect>;

describe('Profile Page Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('redirects to login when no session token exists', async () => {
    mockCookies.mockResolvedValue({
      get: jest.fn(() => undefined),
    } as any);

    const { default: ProfilePage } = await import('@/app/profile/page');

    try {
      await ProfilePage();
    } catch (_error) {}

    expect(mockRedirect).toHaveBeenCalledWith('/login');
  });

  test('redirects to login when session token is invalid', async () => {
    mockCookies.mockResolvedValue({
      get: jest.fn(() => ({ value: 'invalid-token' })),
    } as any);

    const { default: ProfilePage } = await import('@/app/profile/page');

    try {
      await ProfilePage();
    } catch (_error) {}

    expect(mockRedirect).toHaveBeenCalledWith('/login');
  });

  test('displays profile page when valid session exists', async () => {
    const googleId = `test_google_${Date.now()}_${Math.random()}`;
    const user = await createUser(googleId, 'Test User');
    const session = await createSession(user.id);

    mockCookies.mockResolvedValue({
      get: jest.fn(() => ({ value: session.token })),
    } as any);

    const { default: ProfilePage } = await import('@/app/profile/page');

    const _result = await ProfilePage();

    expect(mockRedirect).not.toHaveBeenCalled();
  });

  test('displays correct session information', async () => {
    const googleId = `test_google_${Date.now()}_${Math.random()}`;
    const user = await createUser(googleId, 'Test User');
    const session = await createSession(user.id);

    mockCookies.mockResolvedValue({
      get: jest.fn(() => ({ value: session.token })),
    } as any);

    const { default: ProfilePage } = await import('@/app/profile/page');
    const pageJSX = await ProfilePage();

    render(pageJSX);

    expect(screen.getByText(session.id)).toBeInTheDocument();
    expect(screen.getByText(/Active/)).toBeInTheDocument();
    expect(screen.getByText('Session Info')).toBeInTheDocument();
    expect(mockRedirect).not.toHaveBeenCalled();
  });
});
