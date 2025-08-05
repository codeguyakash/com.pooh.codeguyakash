import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  tokenRefresh,
  verifyAccessToken,
  register,
} from '../api/modules/authApi';
import { useToast } from './ToastContext';
import { navigate } from '../navigation/navigationRef';

interface AuthContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  login: (access: string, refresh: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (access: string, refresh: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);

  const loadTokens = async () => {
    const access = await AsyncStorage.getItem('accessToken');
    const refresh = await AsyncStorage.getItem('refreshToken');
    setAccessToken(access);
    setRefreshToken(refresh);
    return { access, refresh };
  };

  const login = async (access: string, refresh: string) => {
    await AsyncStorage.setItem('accessToken', access);
    await AsyncStorage.setItem('refreshToken', refresh);
    setAccessToken(access);
    setRefreshToken(refresh);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await AsyncStorage.clear();
    setAccessToken(null);
    setRefreshToken(null);
    setIsAuthenticated(false);
  };
  const register = async (access: string, refresh: string) => {
    await AsyncStorage.setItem('accessToken', access);
    await AsyncStorage.setItem('refreshToken', refresh);
    setAccessToken(access);
    setRefreshToken(refresh);
    setIsAuthenticated(true);
  };

  const checkAuthOld = async () => {
    try {
      const { access, refresh } = await loadTokens();

      if (!access || !refresh) {
        return logout();
      }

      const isValid = await verifyAccessToken(access);

      if (isValid) {
        setAccessToken(access);
        setRefreshToken(refresh);
        setIsAuthenticated(true);
        navigate('Profile');
        return;
      }

      // If invalid but no error thrown → refresh here
      console.log('Access token invalid, trying refresh...');
      await handleTokenRefresh(refresh);
    } catch (error) {
      console.warn('Access token verification threw error, trying refresh...');
      const storedRefresh = await AsyncStorage.getItem('refreshToken');
      await handleTokenRefresh(storedRefresh);
    } finally {
      setLoading(false);
    }
  };

  const handleTokenRefresh = async (refreshTokenVal: string | null) => {
    if (!refreshTokenVal) {
      showToast('Session expired. Please log in again.');
      return logout();
    }

    try {
      const response = await tokenRefresh({ refreshToken: refreshTokenVal });
      const newAccess = response.data?.data?.accessToken;
      const newRefresh = response.data?.data?.refreshToken;

      if (!newAccess || !newRefresh) throw new Error('Invalid refresh data');

      await login(newAccess, newRefresh);
      showToast('Session refreshed.');
    } catch (err) {
      console.error('Refresh failed:', err);
      showToast('Session expired. Please log in again.');
      logout();
    }
  };

  const checkAuth = async () => {
    try {
      const { access, refresh } = await loadTokens();

      if (!access || !refresh) {
        return logout();
      }

      const isValid = await verifyAccessToken(access);
      if (isValid) {
        setAccessToken(access);
        setRefreshToken(refresh);
        setIsAuthenticated(true);
        navigate('Profile');
      } else {
        console.log('Access token invalid, trying refresh...');
        showToast('Session expired. Please log in again.');
      }
    } catch (error) {
      console.warn('Access token failed. Trying refresh...');
      try {
        const storedRefresh = await AsyncStorage.getItem('refreshToken');
        const response = await tokenRefresh({ refreshToken: storedRefresh });

        const newAccess = response.data?.data?.accessToken;
        const newRefresh = response.data?.data?.refreshToken;

        if (!newAccess || !newRefresh) throw new Error('Invalid refresh data');

        await login(newAccess, newRefresh);
        showToast('Session refreshed. Logging in...');
      } catch (err) {
        console.error('Refresh failed:', err);
        showToast('Session expired. Please log in again.');
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        accessToken,
        refreshToken,
        login,
        logout,
        register,
        loading,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
