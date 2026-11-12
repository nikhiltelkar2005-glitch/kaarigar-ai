import { db } from '../../config/database';
import { AppError } from '../../utils/AppError';
import type { UpdateArtisanInput } from './artisans.schema';

/**
 * ArtisansService — owns all Artisan Profile CRUD operations.
 * Dashboard metrics are handled by the separate DashboardService.
 */
export class ArtisansService {
  static async getProfile(userId: string) {
    const profile = await db.artisanProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: { id: true, email: true, phone: true, role: true, createdAt: true },
        },
      },
    });
    if (!profile) throw new AppError('Artisan profile not found.', 404);
    return profile;
  }

  static async updateProfile(userId: string, input: UpdateArtisanInput) {
    const existing = await db.artisanProfile.findUnique({ where: { userId } });
    if (!existing) throw new AppError('Artisan profile not found.', 404);

    return db.artisanProfile.update({ where: { userId }, data: { ...input } });
  }
}

