import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { randomUUID } from 'node:crypto'
import type { StringValue } from 'ms'

import type { JwtPayload, TokenServicePort } from '../../../ports/out/token-service.port'

@Injectable()
export class JwtTokenServiceAdapter implements TokenServicePort {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async generateAccessToken(payload: JwtPayload): Promise<string> {
    const secret = this.configService.getOrThrow<string>('jwt.accessSecret')

    const expiresIn = this.configService.getOrThrow<string>('jwt.accessExpiresIn') as StringValue

    return this.jwtService.signAsync(payload, {
      secret,
      expiresIn,
    })
  }

  async generateRefreshToken(payload: JwtPayload): Promise<string> {
    const secret = this.configService.getOrThrow<string>('jwt.refreshSecret')

    const expiresIn = this.configService.getOrThrow<string>('jwt.refreshExpiresIn') as StringValue

    return this.jwtService.signAsync(
      {
        ...payload,
        jti: randomUUID(),
      },
      {
        secret,
        expiresIn,
      }
    )
  }

  async verifyRefreshToken(token: string): Promise<JwtPayload> {
    const secret = this.configService.getOrThrow<string>('jwt.refreshSecret')

    return this.jwtService.verifyAsync<JwtPayload>(token, {
      secret,
    })
  }
}
