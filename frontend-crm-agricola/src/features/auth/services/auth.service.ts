import { apiClient } from '../../../services/api-client'
import type { RegisterUserData, RegisterUserResponse } from '../types'

const AUTH_ENDPOINTS = {
  register: '/usuarios/registro',
} as const

export async function registerUser(userData: RegisterUserData): Promise<RegisterUserResponse> {
  return apiClient<RegisterUserResponse>(AUTH_ENDPOINTS.register, {
    method: 'POST',
    body: userData,
  })
}
