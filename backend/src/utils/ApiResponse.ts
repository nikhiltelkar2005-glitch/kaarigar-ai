import { Response } from 'express';

interface SuccessPayload<T> {
  success: true;
  message: string;
  data: T;
}

interface ErrorPayload {
  success: false;
  message: string;
  errors?: unknown;
}

export class ApiResponse {
  static success<T>(
    res: Response,
    message: string,
    data: T,
    statusCode = 200,
  ): Response {
    const payload: SuccessPayload<T> = { success: true, message, data };
    return res.status(statusCode).json(payload);
  }

  static error(
    res: Response,
    message: string,
    statusCode = 500,
    errors?: unknown,
  ): Response {
    const payload: ErrorPayload = { success: false, message, errors };
    return res.status(statusCode).json(payload);
  }
}

