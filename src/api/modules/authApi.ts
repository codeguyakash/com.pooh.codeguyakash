import { getMethod, postMethod } from '../httpMethods';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '../../types/apiTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const login = (payload: LoginRequest): Promise<LoginResponse> =>
  postMethod<LoginResponse>('/auth/login', payload);

export const logout = async (): Promise<void> => {
  const refreshToken = await AsyncStorage.getItem('refreshToken');
  return getMethod<void>('/auth/logout', {
    headers: {
      'x-refresh-token': refreshToken || '',
    },
  });
};

export const register = (payload: RegisterRequest): Promise<RegisterResponse> =>
  postMethod<RegisterResponse>('/auth/register', payload);
