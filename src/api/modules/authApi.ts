import { getMethod, postMethod, putMethod } from '../httpMethods';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  UpdateUserRequest,
} from '../../types/apiTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const login = (payload: LoginRequest): Promise<LoginResponse> =>
  postMethod<LoginResponse>('/auth/login', payload);

export const logout = async (): Promise<void> => {
  const refreshToken = await AsyncStorage.getItem('refreshToken');
  console.log('Logging out with refresh token:', refreshToken);
  return getMethod<void>('/auth/logout', {
    headers: {
      'x-refresh-token': refreshToken || '',
    },
  });
};

export const register = (payload: RegisterRequest): Promise<RegisterResponse> =>
  postMethod<RegisterResponse>('/auth/register', payload);

export const getUserData = (userId: string): Promise<LoginResponse> =>
  getMethod<LoginResponse>(`/auth/user/${userId}`);

export const tokenRefresh = (payload: any): Promise<any> =>
  postMethod<any>('/auth/token-refresh', payload);

export const verifyAccessToken = async (
  accessToken: string
): Promise<boolean> => {
  // console.log('Verifying access token:', accessToken);
  try {
    const response = await postMethod<LoginResponse>(
      '/auth/verify',
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log('Access token verification response:', response);
    return response.success;
  } catch (error) {
    console.error('Access token verification failed:', error);
    return false;
  }
};

///

export const update = (payload: UpdateUserRequest): Promise<any> => {
  const userId = payload.id;
  return putMethod<UpdateUserRequest>(`/auth/user/update/${userId}`, payload);
};
