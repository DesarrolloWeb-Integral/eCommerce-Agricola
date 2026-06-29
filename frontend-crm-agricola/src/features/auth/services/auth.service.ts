import { apiClient } from '../../../services/api-client';
import type {
  AuthenticatedUser,
  LoginResponse,
  LoginUserData,
  LogoutResponse,
  RegisterUserData,
  RegisterUserResponse,
} from '../types';

const AUTH_ENDPOINTS = {
  register: '/usuarios/registro',
  login: '/auth/login',
  refresh: '/auth/refresh',
  logout: '/auth/logout',
  me: '/auth/me',
} as const;

export async function registerUser(userData: RegisterUserData): Promise<RegisterUserResponse> {
  return apiClient<RegisterUserResponse>(AUTH_ENDPOINTS.register, {
    method: 'POST',
    body: userData,
  });
}

export async function loginUser(userData: LoginUserData): Promise<LoginResponse> {
  return apiClient<LoginResponse>('/auth/login', {
    method: 'POST',
    body: userData,
  });
}

export async function refreshAccessToken(): Promise<LoginResponse> {
  return apiClient<LoginResponse>(AUTH_ENDPOINTS.refresh, {
    method: 'POST',
  });
}

export async function logoutUser(): Promise<LogoutResponse> {
  return apiClient<LogoutResponse>(AUTH_ENDPOINTS.logout, {
    method: 'POST',
  });
}

export async function getAuthenticatedUser(): Promise<AuthenticatedUser> {
  return apiClient<AuthenticatedUser>(AUTH_ENDPOINTS.me, {
    method: 'GET',
    requiresAuth: true,
  });
}
