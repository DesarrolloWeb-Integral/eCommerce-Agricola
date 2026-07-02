import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { createHash } from 'node:crypto'

import { AUTH_USER_REPOSITORY_PORT } from '../../ports/out/auth-user.repository.port'
import type { AuthUserRepositoryPort } from '../../ports/out/auth-user.repository.port'
import { TOKEN_SERVICE_PORT } from '../../ports/out/token-service.port'
import type { AuthTokens, JwtPayload, TokenServicePort } from '../../ports/out/token-service.port'
import { PASSWORD_HASHER_PORT } from '../../../usuarios/ports/out/password-hasher.port'
import type { PasswordHasherPort } from '../../../usuarios/ports/out/password-hasher.port'
import { EstadoCuenta } from '../../../usuarios/domain/value-objects/estado-cuenta.enum'

export interface RefrescarTokenInput {
  refreshToken: string
}

@Injectable()
export class RefrescarTokenUseCase {
  constructor(
    @Inject(AUTH_USER_REPOSITORY_PORT)
    private readonly authUserRepository: AuthUserRepositoryPort,

    @Inject(PASSWORD_HASHER_PORT)
    private readonly passwordHasher: PasswordHasherPort,

    @Inject(TOKEN_SERVICE_PORT)
    private readonly tokenService: TokenServicePort
  ) {}

  async execute(input: RefrescarTokenInput): Promise<AuthTokens> {
    const payload = await this.verifyRefreshToken(input.refreshToken)

    const usuario = await this.authUserRepository.findById(payload.sub)

    if (
      !usuario ||
      !usuario.isActive ||
      usuario.estadoCuenta === EstadoCuenta.CANCELADA ||
      !usuario.refreshTokenHash
    ) {
      throw new UnauthorizedException('El refresh token no es válido o ya expiró.')
    }

    const refreshTokenMatches = await this.passwordHasher.compare(
      this.createRefreshTokenFingerprint(input.refreshToken),
      usuario.refreshTokenHash
    )

    if (!refreshTokenMatches) {
      throw new UnauthorizedException('El refresh token no es válido o ya expiró.')
    }

    const tokenPayload = {
      sub: usuario.id,
      email: usuario.email,
      role: usuario.role,
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.generateAccessToken(tokenPayload),
      this.tokenService.generateRefreshToken(tokenPayload),
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

  private async verifyRefreshToken(refreshToken: string): Promise<JwtPayload> {
    try {
      return await this.tokenService.verifyRefreshToken(refreshToken)
    } catch {
      throw new UnauthorizedException('El refresh token no es válido o ya expiró.')
    }
  }

  private createRefreshTokenFingerprint(refreshToken: string): string {
    return createHash('sha256').update(refreshToken).digest('hex')
  }
}
