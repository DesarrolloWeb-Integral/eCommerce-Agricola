import { ForbiddenException, Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { createHash } from 'node:crypto'

import { AUTH_USER_REPOSITORY_PORT } from '../../ports/out/auth-user.repository.port'
import type { AuthTokens, TokenServicePort } from '../../ports/out/token-service.port'
import { TOKEN_SERVICE_PORT } from '../../ports/out/token-service.port'
import { PASSWORD_HASHER_PORT } from '../../../usuarios/ports/out/password-hasher.port'
import type { PasswordHasherPort } from '../../../usuarios/ports/out/password-hasher.port'
import type { AuthUserRepositoryPort } from '../../ports/out/auth-user.repository.port'

export interface IniciarSesionInput {
  email: string
  password: string
}

@Injectable()
export class IniciarSesionUseCase {
  constructor(
    @Inject(AUTH_USER_REPOSITORY_PORT)
    private readonly authUserRepository: AuthUserRepositoryPort,

    @Inject(PASSWORD_HASHER_PORT)
    private readonly passwordHasher: PasswordHasherPort,

    @Inject(TOKEN_SERVICE_PORT)
    private readonly tokenService: TokenServicePort
  ) {}

  async execute(input: IniciarSesionInput): Promise<AuthTokens> {
    const email = input.email.trim().toLowerCase()

    const usuario = await this.authUserRepository.findByEmail(email)

    if (!usuario) {
      throw new UnauthorizedException('Correo electrónico o contraseña incorrectos.')
    }

    if (!usuario.isActive) {
      throw new ForbiddenException('La cuenta se encuentra desactivada. Solicita su reactivación.')
    }

    const passwordMatches = await this.passwordHasher.compare(input.password, usuario.passwordHash)

    if (!passwordMatches) {
      throw new UnauthorizedException('Correo electrónico o contraseña incorrectos.')
    }

    const payload = {
      sub: usuario.id,
      email: usuario.email,
      role: usuario.role,
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.generateAccessToken(payload),
      this.tokenService.generateRefreshToken(payload),
    ])

    const refreshTokenHash = await this.passwordHasher.hash(
      this.createRefreshTokenFingerprint(refreshToken)
    )

    await this.authUserRepository.updateRefreshTokenHash(usuario.id, refreshTokenHash)

    return {
      accessToken,
      refreshToken,
    }
  }

  private createRefreshTokenFingerprint(refreshToken: string): string {
    return createHash('sha256').update(refreshToken).digest('hex')
  }
}
