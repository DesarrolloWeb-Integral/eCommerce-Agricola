export type UserRole = 'CLIENTE' | 'PROVEEDOR'

export interface RegisterUserData {
  name: string
  lastName: string
  email: string
  phone: string
  password: string
  role: UserRole
}

export interface RegisterUserResponse {
  id: string
  message: string
}

export interface ApiErrorResponse {
  message: string
  error: string
  statusCode: number
}
