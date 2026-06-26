import { RolUsuario } from '../value-objects/rol-usuario.enum'

export class Usuario {
  constructor(
    public readonly id: string,
    public name: string,
    public lastName: string,
    public email: string,
    public phone: string,
    public passwordHash: string,
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

  updateProfile(name: string, lastName: string, email: string, phone: string): void {
    this.name = name
    this.lastName = lastName
    this.email = email
    this.phone = phone
    this.updatedAt = new Date()
  }
}
