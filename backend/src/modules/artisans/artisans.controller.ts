import { Request, Response, NextFunction } from 'express';
import { ArtisansService } from './artisans.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { AppError } from '../../utils/AppError';

export class ArtisansController {
  static async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new AppError('Unauthorized.', 401);
      const profile = await ArtisansService.getProfile(req.user.id);
      ApiResponse.success(res, 'Artisan profile fetched.', profile);
    } catch (err) { next(err); }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new AppError('Unauthorized.', 401);
      const profile = await ArtisansService.updateProfile(req.user.id, req.body);
      ApiResponse.success(res, 'Artisan profile updated.', profile);
    } catch (err) { next(err); }
  }
}

