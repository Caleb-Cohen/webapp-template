jest.mock('./logger', () => ({
  __esModule: true,
  default: { error: jest.fn() },
}));

jest.mock('next/server', () => ({
  NextResponse: {
    json: (body: any, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      json: () => Promise.resolve(body),
    }),
  },
}));

import { ApiError, handleError } from './error-handler';
import logger from './logger';

describe('error-handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 400 with message for expected ApiError', async () => {
    const res = handleError(ApiError.badRequest('Bad request'));
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({
      status: 'error',
      statusCode: 400,
      message: 'Bad request',
    });
    expect((logger as any).error).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        isExpected: true,
        err: expect.any(ApiError),
      }),
      'API error occurred',
    );
  });

  it('returns 401 with default message for expected ApiError', async () => {
    const res = handleError(ApiError.unauthorized());
    expect(res.status).toBe(401);
    await expect(res.json()).resolves.toEqual({
      status: 'error',
      statusCode: 401,
      message: 'Unauthorized',
    });
    expect((logger as any).error).toHaveBeenCalled();
  });

  it('returns 503 with generic message for unexpected ApiError', async () => {
    const res = handleError(ApiError.serviceUnavailable('Downstream down'));
    expect(res.status).toBe(503);
    await expect(res.json()).resolves.toEqual({
      status: 'error',
      statusCode: 503,
      message: 'An internal error occurred',
    });
    expect((logger as any).error).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 503,
        isExpected: false,
        err: expect.any(ApiError),
      }),
      'API error occurred',
    );
  });

  it('returns 500 with generic message for non-ApiError', async () => {
    const err = new Error('boom');
    const res = handleError(err);
    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toEqual({
      status: 'error',
      statusCode: 500,
      message: 'An internal error occurred',
    });
    expect((logger as any).error).toHaveBeenCalledWith(
      { err },
      'Unexpected error occurred',
    );
  });
});
