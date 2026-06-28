import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'
import type { StringValue } from 'ms'

import { jwtConfig } from '../../config/jwt.config'
import { UsuariosModule } from '../usuarios/usuarios.module'
import { JwtTokenServiceAdapter } from './adapters/out/security/jwt-token-service.adapter'
import { TOKEN_SERVICE_PORT } from './ports/out/token-service.port'
import { UsuariosAuthUserRepositoryAdapter } from './adapters/out/persistence/usuarios-auth-user.repository.adapter'
import { AUTH_USER_REPOSITORY_PORT } from './ports/out/auth-user.repository.port'
import { IniciarSesionUseCase } from './application/use-cases/iniciar-sesion.use-case'
import { AuthController } from './adapters/in/http/controllers/auth.controller'
import { RefrescarTokenUseCase } from './application/use-cases/refrescar-token.use-case'
import { CerrarSesionUseCase } from './application/use-cases/cerrar-sesion.use-case'
import { JwtStrategy } from './adapters/in/passport/jwt.strategy'
import { RolesGuard } from './adapters/in/passport/roles.guard'

@Module({
  imports: [
    UsuariosModule,
    ConfigModule.forFeature(jwtConfig),
    PassportModule.register({
      session: false,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('jwt.accessSecret'),
        signOptions: {
          expiresIn: configService.getOrThrow<string>('jwt.accessExpiresIn') as StringValue,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    IniciarSesionUseCase,
    RefrescarTokenUseCase,
    CerrarSesionUseCase,
    JwtTokenServiceAdapter,
    UsuariosAuthUserRepositoryAdapter,
    JwtStrategy,
    RolesGuard,
    {
      provide: TOKEN_SERVICE_PORT,
      useExisting: JwtTokenServiceAdapter,
    },
    {
      provide: AUTH_USER_REPOSITORY_PORT,
      useExisting: UsuariosAuthUserRepositoryAdapter,
    },
  ],
})
export class AuthModule {}
