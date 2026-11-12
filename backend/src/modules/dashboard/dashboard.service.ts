import { db } from '../../config/database';
import { AppError } from '../../utils/AppError';

/**
 * DashboardService — owns all workshop metrics and analytics.
 * Separated from ArtisansService to keep the profile module focused.
 */
export class DashboardService {
  static async getMetrics(userId: string) {
    const profile = await db.artisanProfile.findUnique({
      where: { userId },
      include: {
        products: {
          orderBy: { createdAt: 'desc' },
          include: { images: { where: { isPrimary: true }, take: 1 } },
        },
      },
    });

    if (!profile) throw new AppError('Artisan profile not found.', 404);

    const products = profile.products;

    const totalProducts      = products.length;
    const activeProducts     = products.filter((p) => p.status === 'ACTIVE').length;
    const draftProducts      = products.filter((p) => p.status === 'DRAFT').length;
    const outOfStockProducts = products.filter((p) => p.status === 'OUT_OF_STOCK').length;
    const lowStockProducts   = products.filter(
      (p) => p.status === 'ACTIVE' && p.stockQuantity <= 3,
    ).length;
    const totalInventoryUnits = products.reduce((sum, p) => sum + p.stockQuantity, 0);

    // Profile completeness: how many key fields are filled in
    const fields = [
      profile.fullName, profile.businessName, profile.craftType,
      profile.bio, profile.story, profile.city, profile.state,
      profile.upiId, profile.avatarUrl,
      profile.experienceYears != null && profile.experienceYears > 0 ? 'ok' : null,
    ];
    const filled = fields.filter(Boolean).length;
    const profileCompleteness = Math.round((filled / fields.length) * 100);

    return {
      artisan: {
        id: profile.id,
        fullName: profile.fullName,
        businessName: profile.businessName,
        craftType: profile.craftType,
        isVerified: profile.isVerified,
        avatarUrl: profile.avatarUrl,
        city: profile.city,
        state: profile.state,
        profileCompleteness,
      },
      metrics: {
        totalProducts,
        activeProducts,
        draftProducts,
        outOfStockProducts,
        lowStockProducts,
        totalInventoryUnits,
      },
      recentProducts: products.slice(0, 5).map((p) => ({
        id: p.id,
        title: p.title,
        status: p.status,
        stockQuantity: p.stockQuantity,
        finalPrice: p.finalPrice,
        primaryImage: p.images[0]?.enhancedUrl ?? p.images[0]?.rawUrl ?? null,
        createdAt: p.createdAt,
      })),
    };
  }
}

