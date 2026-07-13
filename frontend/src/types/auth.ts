export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface ProfileResponse {
  userId: number;
  email: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}
