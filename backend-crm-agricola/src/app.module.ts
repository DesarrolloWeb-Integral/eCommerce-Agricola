import { Module } from '@nestjs/common'
import { AuthModule } from './modules/auth/auth.module'
import { UsuariosModule } from './modules/usuarios/usuarios.module'
import { ProductoresModule } from './modules/productores/productores.module'
import { ProductosModule } from './modules/productos/productos.module'
import { ChatModule } from './modules/chat/chat.module'
import { PedidosModule } from './modules/pedidos/pedidos.module'
import { PagosComisionesModule } from './modules/payments/pagos-comisiones.module'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.BD_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),

    AuthModule,
    UsuariosModule,
    ProductoresModule,
    ProductosModule,
    ChatModule,
    PedidosModule,
    PagosComisionesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
