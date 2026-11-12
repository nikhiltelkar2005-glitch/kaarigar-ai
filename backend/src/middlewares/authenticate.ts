import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { db } from '../config/database';
import { ApiResponse } from '../utils/ApiResponse';
import { AppError } from '../utils/AppError';

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

/**
 * Verifies the Bearer token in Authorization header.
 * On success, populates req.user with { id, email, role, artisanProfileId }.
 *
 * Used by Suhani and Vishwajit as well — do not change the shape of req.user
 * without notifying the team.
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    ApiResponse.error(res, 'Authentication required.', 401);
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;

    // Confirm the user still exists in the database
    const user = await db.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        artisanProfile: { select: { id: true } },
      },
    });

    if (!user) {
      ApiResponse.error(res, 'User not found.', 401);
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      artisanProfileId: user.artisanProfile?.id,
    };

    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      ApiResponse.error(res, 'Session expired. Please refresh your token.', 401);
      return;
    }
    ApiResponse.error(res, 'Invalid token.', 401);
  }
};

/**
 * Guard that requires the artisan to have completed their profile.
 * Attach after `authenticate` on routes that need it.
 */
export const requireProfile = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.user?.artisanProfileId) {
    throw new AppError('Artisan profile not found. Complete your registration.', 403);
  }
  next();
};

