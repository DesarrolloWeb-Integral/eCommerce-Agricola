import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ProductosModule } from '../productos/productos.module'
import { PedidoEntity } from './adapters/out/persistence/typeorm/entities/pedido.entity'
import { TypeormPedidoRepository } from './adapters/out/persistence/typeorm/repositories/typeorm-pedido.repository'
import { ProductoConsultaAdapter } from './adapters/out/productos/producto-consulta.adapter'
import { PEDIDO_REPOSITORY_PORT } from './ports/out/pedido-repository.port'
import { PRODUCTO_CONSULTA_PORT } from './ports/out/producto-consulta.port'
import { PedidosController } from './adapters/in/http/controllers/pedidos.controller'
import { CrearPedidoUseCase } from './application/use-cases/crear-pedido.use-case'
import { AuthModule } from '../auth/auth.module'
import { ListarMisPedidosUseCase } from './application/use-cases/listar-mis-pedidos.use-case'
import { ProducerProfileModule } from 'src/producer-profile/producer-profile.module'
import { ListarPedidosDeMisProductosUseCase } from './application/use-cases/listar-pedidos-de-mis-productos.use-case'
import { CancelarPedidoUseCase } from './application/use-cases/cancelar-pedido.use-case'
import { ConfirmarPedidoUseCase } from './application/use-cases/confirmar-pedido.use-case'
import { RegistrarPedidoConfirmadoHandler } from './application/event-handlers/registrar-pedido-confirmado.handler'
import { ConfirmarPedidoDesdePagoUseCase } from './application/use-cases/confirmar-pedido-desde-pago.use-case'
import { UsuariosModule } from '../usuarios/usuarios.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([PedidoEntity]),
    ProductosModule,
    AuthModule,
    ProducerProfileModule,
    UsuariosModule,
  ],
  controllers: [PedidosController],
  providers: [
    CrearPedidoUseCase,
    ListarMisPedidosUseCase,
    ListarPedidosDeMisProductosUseCase,
    CancelarPedidoUseCase,
    ConfirmarPedidoUseCase,
    ConfirmarPedidoDesdePagoUseCase,
    RegistrarPedidoConfirmadoHandler,
    TypeormPedidoRepository,
    ProductoConsultaAdapter,
    {
      provide: PEDIDO_REPOSITORY_PORT,
      useExisting: TypeormPedidoRepository,
    },
    {
      provide: PRODUCTO_CONSULTA_PORT,
      useExisting: ProductoConsultaAdapter,
    },
  ],
  exports: [PEDIDO_REPOSITORY_PORT, ConfirmarPedidoDesdePagoUseCase],
})
export class PedidosModule {}
