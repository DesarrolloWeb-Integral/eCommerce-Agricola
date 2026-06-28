import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { createHash } from 'node:crypto'

import { PASSWORD_HASHER_PORT } from '../../../usuarios/ports/out/password-hasher.port'
import type { PasswordHasherPort } from '../../../usuarios/ports/out/password-hasher.port'
import { AUTH_USER_REPOSITORY_PORT } from '../../ports/out/auth-user.repository.port'
import type { AuthUserRepositoryPort } from '../../ports/out/auth-user.repository.port'
import { TOKEN_SERVICE_PORT } from '../../ports/out/token-service.port'
import type { JwtPayload, TokenServicePort } from '../../ports/out/token-service.port'

export interface CerrarSesionInput {
  refreshToken: string
}

@Injectable()
export class CerrarSesionUseCase {
  constructor(
    @Inject(AUTH_USER_REPOSITORY_PORT)
    private readonly authUserRepository: AuthUserRepositoryPort,

    @Inject(PASSWORD_HASHER_PORT)
    private readonly passwordHasher: PasswordHasherPort,

    @Inject(TOKEN_SERVICE_PORT)
    private readonly tokenService: TokenServicePort
  ) {}

  async execute(input: CerrarSesionInput): Promise<void> {
    const payload = await this.verifyRefreshToken(input.refreshToken)

    const usuario = await this.authUserRepository.findById(payload.sub)

    if (!usuario || !usuario.refreshTokenHash) {
      throw new UnauthorizedException('El refresh token no es válido o ya expiró.')
    }

    const refreshTokenMatches = await this.passwordHasher.compare(
      this.createRefreshTokenFingerprint(input.refreshToken),
      usuario.refreshTokenHash
    )

    if (!refreshTokenMatches) {
      throw new UnauthorizedException('El refresh token no es válido o ya expiró.')
    }

    await this.authUserRepository.clearRefreshTokenHash(usuario.id)
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
