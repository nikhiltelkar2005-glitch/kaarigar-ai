import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { ApiResponse } from '../../utils/ApiResponse';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await AuthService.register(req.body);
      ApiResponse.success(res, 'Registration successful.', data, 201);
    } catch (err) {
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await AuthService.login(req.body);
      ApiResponse.success(res, 'Login successful.', data);
    } catch (err) {
      next(err);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tokens = await AuthService.refresh(req.body.refreshToken);
      ApiResponse.success(res, 'Tokens refreshed.', tokens);
    } catch (err) {
      next(err);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await AuthService.logout(req.body?.refreshToken);
      ApiResponse.success(res, 'Logged out successfully.', null);
    } catch (err) {
      next(err);
    }
  }

  static async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // req.user is populated by the authenticate middleware
      ApiResponse.success(res, 'Session valid.', { user: req.user });
    } catch (err) {
      next(err);
    }
  }
}

