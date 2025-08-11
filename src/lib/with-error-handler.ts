import { NextRequest, NextResponse } from 'next/server';
import { handleError } from './error-handler';

export function withErrorHandler(
  handler: (request: NextRequest) => NextResponse | Promise<NextResponse>,
) {
  return async function (request: NextRequest): Promise<NextResponse> {
    try {
      return await Promise.resolve(handler(request));
    } catch (error) {
      return handleError(error);
    }
  };
}
