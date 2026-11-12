import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ApiResponse } from '../utils/ApiResponse';

/**
 * Usage:
 *   router.post('/register', validate(registerSchema), controller.register)
 *
 * The schema should validate `{ body, query, params }`.
 */
export const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      // Write validated + coerced values back onto the request
      req.body = parsed.body ?? req.body;
      req.query = parsed.query ?? req.query;
      req.params = parsed.params ?? req.params;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        ApiResponse.error(res, 'Validation failed.', 422, err.flatten().fieldErrors);
        return;
      }
      next(err);
    }
  };

