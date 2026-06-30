import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductoEntity } from './adapters/out/persistence/typeorm/entities/producto.entity'
import { TypeormProductoRepository } from './adapters/out/persistence/typeorm/repositories/typeorm-producto.repository'
import { RegistrarProductoUseCase } from './application/use-cases/registrar-producto.use-case'
import { EditarProductoUseCase } from './application/use-cases/editar-producto.use-case'
import { EliminarProductoUseCase } from './application/use-cases/eliminar-producto.use-case'
import { ListarProductosUseCase } from './application/use-cases/listar-productos.use-case'
import { ProductosController } from './adapters/in/http/controllers/productos.controller'
import { PRODUCTO_REPOSITORY_PORT } from './ports/out/producto-repository.port'
import { ProducerProfileModule } from 'src/producer-profile/producer-profile.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductoEntity]),
    ProducerProfileModule, // para obtener el perfil del productor autenticado
  ],
  controllers: [ProductosController],
  providers: [
    RegistrarProductoUseCase,
    EditarProductoUseCase,
    EliminarProductoUseCase,
    ListarProductosUseCase,
    TypeormProductoRepository,
    {
      provide: PRODUCTO_REPOSITORY_PORT,
      useExisting: TypeormProductoRepository,
    },
  ],
  exports: [PRODUCTO_REPOSITORY_PORT],
})
export class ProductosModule {}
