import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { storage } from '../utils/storage';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor: attach Bearer token ───────────────────────────────
apiClient.interceptors.request.use(async (config) => {
  const token = await storage.get('access_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor: auto-refresh on 401 ─────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string }>) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refreshToken = await storage.get('refresh_token');

      if (refreshToken) {
        try {
          const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken }); // Nikhil
          const { accessToken, refreshToken: newRefresh } = data.data;

          await storage.set('access_token', accessToken);
          await storage.set('refresh_token', newRefresh);

          original.headers = original.headers ?? {};
          original.headers.Authorization = `Bearer ${accessToken}`;

          return apiClient(original);
        } catch {
          // Refresh failed — clear session, the AuthContext listener will redirect
          await storage.remove('access_token');
          await storage.remove('refresh_token');
        }
      }
    }

    const message =
      error.response?.data?.message ?? error.message ?? 'An unexpected error occurred.';
    return Promise.reject(new Error(message));
  },
);

