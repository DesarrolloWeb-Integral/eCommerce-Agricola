export type UserRole = 'ADMINISTRADOR' | 'CLIENTE' | 'PROVEEDOR';

export interface RegisterUserData {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
}

export interface RegisterUserResponse {
  id: string;
  message: string;
}

export interface ApiErrorResponse {
  message: string;
  error: string;
  statusCode: number;
}

export interface LoginUserData {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
}

export interface LogoutResponse {
  message: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
}
