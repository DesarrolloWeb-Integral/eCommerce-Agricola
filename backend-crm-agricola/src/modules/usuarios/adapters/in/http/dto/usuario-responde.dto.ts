import { RolUsuario } from '../../../../domain/value-objects/rol-usuario.enum'
import { EstadoCuenta } from '../../../../domain/value-objects/estado-cuenta.enum'

/**
 * DTO de respuesta para Usuario.
 *
 * REGLA: este es el ÚNICO objeto que debe salir hacia el cliente
 * cuando se devuelve información de un usuario. Nunca se debe
 * serializar la entidad de dominio Usuario directamente, porque
 * esta SÍ contiene passwordHash y refreshTokenHash.
 *
 * Reemplaza el mapeo manual inline (toResponse) que existía en
 * UsuariosController — centraliza el contrato de salida en un solo
 * lugar para que ningún endpoint nuevo pueda olvidar excluir el hash.
 */
export class UsuarioResponseDto {
  id: string
  name: string
  lastName: string
  email: string
  phone: string | null
  role: RolUsuario
  isActive: boolean
  estadoCuenta: EstadoCuenta
  privacyNoticeAcceptedAt: Date | null
  privacyNoticeVersion: string | null
  optionalPurposesAllowed: boolean
  optionalPurposesUpdatedAt: Date | null
  cancellationRequestedAt: Date | null
  cancelledAt: Date | null
  personalDataDisassociatedAt: Date | null
  createdAt: Date
  updatedAt: Date

  private constructor(data: {
    id: string
    name: string
    lastName: string
    email: string
    phone: string | null
    role: RolUsuario
    isActive: boolean
    estadoCuenta: EstadoCuenta
    privacyNoticeAcceptedAt: Date | null
    privacyNoticeVersion: string | null
    optionalPurposesAllowed: boolean
    optionalPurposesUpdatedAt: Date | null
    cancellationRequestedAt: Date | null
    cancelledAt: Date | null
    personalDataDisassociatedAt: Date | null
    createdAt: Date
    updatedAt: Date
  }) {
    this.id = data.id
    this.name = data.name
    this.lastName = data.lastName
    this.email = data.email
    this.phone = data.phone
    this.role = data.role
    this.isActive = data.isActive
    this.estadoCuenta = data.estadoCuenta
    this.privacyNoticeAcceptedAt = data.privacyNoticeAcceptedAt
    this.privacyNoticeVersion = data.privacyNoticeVersion
    this.optionalPurposesAllowed = data.optionalPurposesAllowed
    this.optionalPurposesUpdatedAt = data.optionalPurposesUpdatedAt
    this.cancellationRequestedAt = data.cancellationRequestedAt
    this.cancelledAt = data.cancelledAt
    this.personalDataDisassociatedAt = data.personalDataDisassociatedAt
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  /**
   * Construye el DTO a partir de la entidad de dominio Usuario.
   * Acepta cualquier objeto con forma de Usuario (incluida la entidad
   * completa con passwordHash/refreshTokenHash) y descarta esos campos
   * explícitamente — nunca los reasigna.
   */
  static fromDomain(usuario: {
    id: string
    name: string
    lastName: string
    email: string
    phone: string | null
    role: RolUsuario
    isActive: boolean
    estadoCuenta: EstadoCuenta
    privacyNoticeAcceptedAt: Date | null
    privacyNoticeVersion: string | null
    optionalPurposesAllowed: boolean
    optionalPurposesUpdatedAt: Date | null
    cancellationRequestedAt: Date | null
    cancelledAt: Date | null
    personalDataDisassociatedAt: Date | null
    createdAt: Date
    updatedAt: Date
    // passwordHash y refreshTokenHash pueden venir en el objeto de entrada
    // pero deliberadamente NUNCA se leen ni se copian a este DTO.
    passwordHash?: string
    refreshTokenHash?: string | null
  }): UsuarioResponseDto {
    return new UsuarioResponseDto({
      id: usuario.id,
      name: usuario.name,
      lastName: usuario.lastName,
      email: usuario.email,
      phone: usuario.phone,
      role: usuario.role,
      isActive: usuario.isActive,
      estadoCuenta: usuario.estadoCuenta,
      privacyNoticeAcceptedAt: usuario.privacyNoticeAcceptedAt,
      privacyNoticeVersion: usuario.privacyNoticeVersion,
      optionalPurposesAllowed: usuario.optionalPurposesAllowed,
      optionalPurposesUpdatedAt: usuario.optionalPurposesUpdatedAt,
      cancellationRequestedAt: usuario.cancellationRequestedAt,
      cancelledAt: usuario.cancelledAt,
      personalDataDisassociatedAt: usuario.personalDataDisassociatedAt,
      createdAt: usuario.createdAt,
      updatedAt: usuario.updatedAt,
    })
  }

  static fromDomainList(
    usuarios: Parameters<typeof UsuarioResponseDto.fromDomain>[0][]
  ): UsuarioResponseDto[] {
    return usuarios.map((u) => UsuarioResponseDto.fromDomain(u))
  }
}
