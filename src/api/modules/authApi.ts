import { postMethod } from '../httpMethods';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '../../types/apiTypes';

export const login = (payload: LoginRequest): Promise<LoginResponse> =>
  postMethod<LoginResponse>('/auth/login', payload);

export const register = (payload: RegisterRequest): Promise<RegisterResponse> =>
  postMethod<RegisterResponse>('/auth/register', payload);
