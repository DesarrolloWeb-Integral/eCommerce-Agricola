export const PASSWORD_HASHER_PORT = Symbol('PASSWORD_HASHER_PORT')

export interface PasswordHasherPort {
  hash(password: string): Promise<string>

  compare(password: string, passwordHash: string): Promise<boolean>
}
