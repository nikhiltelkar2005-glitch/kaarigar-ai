import { Request, Response, NextFunction } from 'express';
import { DashboardService } from './dashboard.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { AppError } from '../../utils/AppError';

export class DashboardController {
  static async getMetrics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new AppError('Unauthorized.', 401);
      const data = await DashboardService.getMetrics(req.user.id);
      ApiResponse.success(res, 'Dashboard metrics fetched.', data);
    } catch (err) { next(err); }
  }
}

