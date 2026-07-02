import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuditoriaEntity } from './adapters/out/persistence/typeorm/entities/auditoria.entity'
import { AuditoriaRepositoryAdapter } from './adapters/out/persistence/typeorm/repositories/auditoria.repository'
import { AuditoriaController } from './adapters/in/http/controllers/auditoria.controller'
import { AUDITORIA_REPOSITORY_PORT } from './adapters/out/auditoria.repository.port'
import { RegistrarLogUseCase } from './application/use-cases/registrar-log.use-case'
import { ConsultarLogsUseCase } from './application/use-cases/consultar-logs.use-case'

@Module({
  imports: [TypeOrmModule.forFeature([AuditoriaEntity])],
  controllers: [AuditoriaController],
  providers: [
    {
      provide: AUDITORIA_REPOSITORY_PORT,
      useClass: AuditoriaRepositoryAdapter,
    },
    RegistrarLogUseCase,
    ConsultarLogsUseCase,
  ],
  exports: [RegistrarLogUseCase, AUDITORIA_REPOSITORY_PORT],
})
export class AuditoriaModule {}
