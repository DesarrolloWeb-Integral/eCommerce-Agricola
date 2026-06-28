import { RolUsuario } from '../value-objects/rol-usuario.enum'

export class Usuario {
  constructor(
    public readonly id: string,
    public name: string,
    public lastName: string,
    public email: string,
    public phone: string,
    public passwordHash: string,
    public refreshTokenHash: string | null,
    public role: RolUsuario,
    public isActive: boolean,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public deletedAt: Date | null
  ) {}

  deactivate(): void {
    this.isActive = false
    this.deletedAt = new Date()
  }

  updateProfile({
    name,
    lastName,
    email,
    phone,
  }: {
    name?: string
    lastName?: string
    email?: string
    phone?: string
  }): void {
    if (name !== undefined) {
      this.name = name
    }

    if (lastName !== undefined) {
      this.lastName = lastName
    }

    if (email !== undefined) {
      this.email = email
    }

    if (phone !== undefined) {
      this.phone = phone
    }

    this.updatedAt = new Date()
  }

  updateRefreshTokenHash(refreshTokenHash: string): void {
    this.refreshTokenHash = refreshTokenHash
    this.updatedAt = new Date()
  }

  clearRefreshTokenHash(): void {
    this.refreshTokenHash = null
    this.updatedAt = new Date()
  }
}
