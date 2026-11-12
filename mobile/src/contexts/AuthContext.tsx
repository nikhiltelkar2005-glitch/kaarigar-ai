import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { apiClient } from '../api/client';
import { storage } from '../utils/storage';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  phone: string | null;
  role: string;
}

export interface ArtisanProfile {
  id: string;
  fullName: string;
  businessName: string;
  craftType: string;
  bio?: string | null;
  story?: string | null;
  experienceYears?: number | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  address?: string | null;
  upiId?: string | null;
  avatarUrl?: string | null;
  isVerified: boolean;
}

export interface RegisterPayload {
  email: string;
  password: string;
  phone?: string;
  fullName: string;
  businessName: string;
  craftType: string;
  city?: string;
  state?: string;
  pincode?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  profile: ArtisanProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  setProfile: React.Dispatch<React.SetStateAction<ArtisanProfile | null>>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser]       = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<ArtisanProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On app launch, restore session from secure storage
  useEffect(() => {
    const restore = async () => {
      try {
        const token = await storage.get('access_token');
        if (!token) return;

        const { data: res } = await apiClient.get('/artisans');
        if (res.success) {
          setProfile(res.data);
          setUser(res.data.user);
        }
      } catch {
        // Token expired and refresh also failed — clear storage
        await storage.remove('access_token');
        await storage.remove('refresh_token');
      } finally {
        setIsLoading(false);
      }
    };
    restore();
  }, []);

  const persistTokens = async (accessToken: string, refreshToken: string) => {
    await storage.set('access_token', accessToken);
    await storage.set('refresh_token', refreshToken);
  };

  const login = async (identifier: string, password: string) => {
    const { data: res } = await apiClient.post('/auth/login', { identifier, password });
    await persistTokens(res.data.tokens.accessToken, res.data.tokens.refreshToken);
    setUser(res.data.user);
    setProfile(res.data.profile);
  };

  const register = async (payload: RegisterPayload) => {
    const { data: res } = await apiClient.post('/auth/register', payload);
    await persistTokens(res.data.tokens.accessToken, res.data.tokens.refreshToken);
    setUser(res.data.user);
    setProfile(res.data.profile);
  };

  const logout = async () => {
    try {
      const refreshToken = await storage.get('refresh_token');
      await apiClient.post('/auth/logout', { refreshToken }).catch(() => {});
    } finally {
      await storage.remove('access_token');
      await storage.remove('refresh_token');
      setUser(null);
      setProfile(null);
    }
  };

  const refreshProfile = useCallback(async () => {
    const { data: res } = await apiClient.get('/artisans');
    if (res.success) {
      setProfile(res.data);
      setUser(res.data.user);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshProfile,
        setProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};

