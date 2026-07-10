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
import { ProducerProfileModule } from './producer-profile/producer-profile.module'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { SolicitudesArcoModule } from './modules/solicitudes-arco/solicitudes-arco.module'
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 20,
      },
    ]),

    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.BD_PASSWORD,
      ssl:
        process.env.DB_SSL === 'true'
          ? { rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false' }
          : false,
      autoLoadEntities: true,
      synchronize: true,
    }),

    EventEmitterModule.forRoot(),

    AuthModule,
    UsuariosModule,
    ProductoresModule,
    ProductosModule,
    ChatModule,
    PedidosModule,
    PagosComisionesModule,
    ProducerProfileModule,
    SolicitudesArcoModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
