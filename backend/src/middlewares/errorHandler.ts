import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { ApiResponse } from '../utils/ApiResponse';
import { logger } from '../utils/logger';

// Must have exactly 4 parameters so Express recognises it as an error handler.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  logger.error(`${req.method} ${req.url} — ${err.message}`);

  if (err instanceof AppError) {
    ApiResponse.error(res, err.message, err.statusCode, err.errors);
    return;
  }

  // Unknown / unhandled error — hide internals in production
  const message =
    process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred.'
      : err.message;

  ApiResponse.error(res, message, 500);
};

