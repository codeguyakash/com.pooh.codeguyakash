export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  statusCode: number;
  data: {
    user: {
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
    };
    accessToken: string;
    refreshToken: string;
  };
  message: string;
  success: boolean;
}
