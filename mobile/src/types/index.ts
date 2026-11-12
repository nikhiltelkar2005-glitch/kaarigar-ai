export interface User {
  id: string;
  email: string;
  phone?: string | null;
  role: 'ARTISAN' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

export interface ArtisanProfile {
  id: string;
  userId: string;
  businessName: string;
  craftType: string;
  bio?: string | null;
  location?: string | null;
  preferredLanguage: string;
  upiId?: string | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface DashboardMetrics {
  totalProducts: number;
  activeListings: number;
  lowStockCount: number;
  totalViews: number;
}

