export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  statusCode: number;
  data: {
    user: {
      fcm_token: string;
      id: number;
      uuid: string;
      name: string;
      email: string;
      role: string;
      is_verified: boolean;
    };
    accessToken: string;
    refreshToken: string;
  };
  message: string;
  success: boolean;
}

export interface LogoutRequest {
  accessToken: string;
  refreshToken: string;
}
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  fcm_token?: string;
}

export interface RegisterResponse {
  statusCode: number;
  data: {
    user: {
      name: string;
      email: string;
      role: string;
      uuid: string;
      is_verified: boolean;
      id: number;
      fcm_token: string | null;
    };
    accessToken: string;
    refreshToken: string;
  };
  message: string;
  success: boolean;
}

export interface UpdateUserRequest {
  id: number;
  name: string;
  email: string;
  role: string;
  is_verified: boolean | null;
  fcm_token: string | null;
}
