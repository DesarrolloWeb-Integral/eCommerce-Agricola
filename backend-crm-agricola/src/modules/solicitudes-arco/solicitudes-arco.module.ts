import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AuthModule } from '../auth/auth.module'
import { PagosComisionesModule } from '../payments/pagos-comisiones.module'
import { PedidosModule } from '../pedidos/pedidos.module'
import { PrivacyConsentsModule } from '../privacy-consents/privacy-consents.module'
import { UsuariosModule } from '../usuarios/usuarios.module'
import { ProducerProfileModule } from 'src/producer-profile/producer-profile.module'
import { UsuariosArcoController } from './adapters/in/http/controllers/usuarios-arco.controller'
import { SolicitudesArcoController } from './adapters/in/http/controllers/solicitudes-arco.controller'
import { SolicitudArcoEntity } from './adapters/out/persistence/typeorm/entities/solicitud-arco.entity'
import { TypeormSolicitudArcoRepository } from './adapters/out/persistence/typeorm/repositories/typeorm-solicitud-arco.repository'
import { ProcesarCancelacionesPendientesJob } from './application/jobs/procesar-cancelaciones-pendientes.job'
import { CancelacionCuentaService } from './application/services/cancelacion-cuenta.service'
import { CrearOposicionTransferenciasUseCase } from './application/use-cases/crear-oposicion-transferencias.use-case'
import { ExportarDatosUsuarioUseCase } from './application/use-cases/exportar-datos-usuario.use-case'
import { ListarMisSolicitudesArcoUseCase } from './application/use-cases/listar-mis-solicitudes-arco.use-case'
import { ListarSolicitudesArcoUseCase } from './application/use-cases/listar-solicitudes-arco.use-case'
import { ResolverSolicitudArcoUseCase } from './application/use-cases/resolver-solicitud-arco.use-case'
import { SolicitarCancelacionCuentaUseCase } from './application/use-cases/solicitar-cancelacion-cuenta.use-case'
import { MantenerCuentaUseCase } from './application/use-cases/mantener-cuenta.use-case'
import { SOLICITUD_ARCO_REPOSITORY_PORT } from './ports/out/solicitud-arco-repository.port'

@Module({
  imports: [
    TypeOrmModule.forFeature([SolicitudArcoEntity]),
    AuthModule,
    UsuariosModule,
    PedidosModule,
    PagosComisionesModule,
    ProducerProfileModule,
    PrivacyConsentsModule,
  ],
  controllers: [SolicitudesArcoController, UsuariosArcoController],
  providers: [
    TypeormSolicitudArcoRepository,
    ListarMisSolicitudesArcoUseCase,
    ListarSolicitudesArcoUseCase,
    CrearOposicionTransferenciasUseCase,
    ResolverSolicitudArcoUseCase,
    ExportarDatosUsuarioUseCase,
    SolicitarCancelacionCuentaUseCase,
    MantenerCuentaUseCase,
    CancelacionCuentaService,
    ProcesarCancelacionesPendientesJob,
    {
      provide: SOLICITUD_ARCO_REPOSITORY_PORT,
      useExisting: TypeormSolicitudArcoRepository,
    },
  ],
  exports: [SOLICITUD_ARCO_REPOSITORY_PORT],
})
export class SolicitudesArcoModule {}
