import { apiClient } from '../api/client';

export { apiClient };

export const AuthService = {
  login: (data: { identifier: string; password: string }) =>
    apiClient.post('/auth/login', data),
  register: (data: { email: string; password: string; businessName: string; craftType: string; phone?: string }) =>
    apiClient.post('/auth/register', data),
  getMe: () =>
    apiClient.get('/auth/me'),
  logout: () =>
    apiClient.post('/auth/logout'),
};

export const ArtisanService = {
  getProfile: () =>
    apiClient.get('/artisans'),
  updateProfile: (data: { businessName?: string; craftType?: string; bio?: string; location?: string; upiId?: string }) =>
    apiClient.put('/artisans', data),
};

export const DashboardService = {
  getMetrics: () =>
    apiClient.get('/dashboard'),
};
