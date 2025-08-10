import { NextResponse } from 'next/server';
import logger from './logger';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isExpected = true,
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static badRequest(message: string) {
    return new ApiError(400, message, true);
  }

  static unauthorized(message = 'Unauthorized') {
    return new ApiError(401, message, true);
  }

  static tooManyRequests(message = 'Too many requests') {
    return new ApiError(429, message, true);
  }

  static serviceUnavailable(message = 'Service unavailable') {
    return new ApiError(503, message, false);
  }
}

export function handleError(error: unknown) {
  if (error instanceof ApiError) {
    logger.error(
      {
        err: error,
        statusCode: error.statusCode,
        isExpected: error.isExpected,
      },
      'API error occurred',
    );

    const message =
      error.isExpected && error.statusCode < 500
        ? error.message
        : 'An internal error occurred';

    return NextResponse.json(
      { status: 'error', statusCode: error.statusCode, message },
      { status: error.statusCode },
    );
  }

  logger.error({ err: error }, 'Unexpected error occurred');
  return NextResponse.json(
    { status: 'error', statusCode: 500, message: 'An internal error occurred' },
    { status: 500 },
  );
}
