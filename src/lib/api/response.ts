import 'server-only';

import { Prisma } from '@/generated/prisma/client';
import { AppError } from '@/lib/errors/app-error';
import { ZodError } from 'zod';

export type ApiSuccess<T> = { success: true; data: T };
export type ApiFailure = { success: false; error: string };
export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export function apiSuccess<T>(data: T, status = 200): Response {
  return Response.json({ success: true, data } satisfies ApiSuccess<T>, { status });
}

export function apiError(error: string, status = 500): Response {
  return Response.json({ success: false, error } satisfies ApiFailure, { status });
}

export function formatZodError(error: ZodError): string {
  const issue = error.issues[0];

  if (!issue) {
    return 'Invalid request.';
  }

  const path = issue.path.join('.');
  return path ? `${path}: ${issue.message}` : issue.message;
}

/**
 * Map known application/validation/database failures to safe API responses.
 * Unexpected errors are logged server-side and returned as a generic 500 so
 * stack traces and database details never reach the client.
 */
export function handleApiError(error: unknown): Response {
  if (error instanceof AppError) {
    return apiError(error.message, error.status);
  }

  if (error instanceof ZodError) {
    return apiError(formatZodError(error), 400);
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return apiError('A record with this value already exists.', 409);
    }

    if (error.code === 'P2025') {
      return apiError('Resource not found.', 404);
    }

    if (error.code === 'P2003') {
      return apiError('The request references a record that does not exist.', 400);
    }
  }

  console.error('[api] Unhandled error:', error);
  return apiError('Internal server error.', 500);
}
