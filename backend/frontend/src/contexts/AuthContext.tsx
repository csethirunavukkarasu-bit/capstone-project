import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { UserDto } from '../types';
import { authApi } from '../api';

interface AuthContextType {
  user: UserDto | null;
  loading: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  register: (data: { username: string; email: string; password: string; displayName: string; bio?: string; profilePictureUrl?: string }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const res = await authApi.me();
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
    } catch {
      setUser(null);
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('user');
      }
    }
    refreshUser();
  }, []);

  const login = async (usernameOrEmail: string, password: string) => {
    const res = await authApi.login({ usernameOrEmail, password });
    localStorage.setItem('access_token', res.data.accessToken);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    setUser(res.data.user);
  };

  const register = async (data: { username: string; email: string; password: string; displayName: string; bio?: string; profilePictureUrl?: string }) => {
    const res = await authApi.register(data);
    localStorage.setItem('access_token', res.data.accessToken);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
