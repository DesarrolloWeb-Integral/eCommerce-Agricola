import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UsuariosController } from './adapters/in/http/controllers/usuarios.controller'
import { UsuarioEntity } from './adapters/out/persistence/typeorm/entities/usuario.entity'
import { TypeormUsuarioRepository } from './adapters/out/persistence/typeorm/repositories/typeorm-usuario.repository'
import { BcryptPasswordHasherAdapter } from './adapters/out/security/bcrypt-password-hasher.adapter'
import { BuscarUsuarioPorEmailUseCase } from './application/use-cases/buscar-usuario-por-email.use-case'
import { BuscarUsuarioPorIdUseCase } from './application/use-cases/buscar-usuario-por-id.use-case'
import { BuscarUsuarioPorTelefonoUseCase } from './application/use-cases/buscar-usuario-por-telefono.use-case'
import { DesactivarUsuarioUseCase } from './application/use-cases/desactivar-usuario.use-case'
import { EditarUsuarioUseCase } from './application/use-cases/editar-usuario.use-case'
import { RegistrarUsuarioUseCase } from './application/use-cases/registrar-usuario.use-case'
import { ActualizarConsentimientosUseCase } from './application/use-cases/actualizar-consentimientos.use-case'
import { PASSWORD_HASHER_PORT } from './ports/out/password-hasher.port'
import { USUARIO_REPOSITORY_PORT } from './ports/out/usuario-repository.port'
import { AuditoriaModule } from '../auditoria/auditoria.module'
import { PrivacyConsentsModule } from '../privacy-consents/privacy-consents.module'

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEntity])],
  controllers: [UsuariosController],
  providers: [
    AuditoriaModule,
    PrivacyConsentsModule,
    RegistrarUsuarioUseCase,
    BuscarUsuarioPorIdUseCase,
    BuscarUsuarioPorEmailUseCase,
    BuscarUsuarioPorTelefonoUseCase,
    EditarUsuarioUseCase,
    DesactivarUsuarioUseCase,
    ActualizarConsentimientosUseCase,
    TypeormUsuarioRepository,
    BcryptPasswordHasherAdapter,
    {
      provide: USUARIO_REPOSITORY_PORT,
      useExisting: TypeormUsuarioRepository,
    },
    {
      provide: PASSWORD_HASHER_PORT,
      useExisting: BcryptPasswordHasherAdapter,
    },
  ],
  exports: [PASSWORD_HASHER_PORT, USUARIO_REPOSITORY_PORT],
})
export class UsuariosModule {}
