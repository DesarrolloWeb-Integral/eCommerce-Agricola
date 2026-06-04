import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { ProductoresModule } from './modules/productores/productores.module';
import { ProductosModule } from './modules/productos/productos.module';
import { ChatModule } from './modules/chat/chat.module';
import { PedidosModule } from './modules/pedidos/pedidos.module';
import { PagosComisionesModule } from './modules/payments/pagos-comisiones.module';

@Module({
  imports: [AuthModule, UsuariosModule, ProductoresModule, ProductosModule, ChatModule, PedidosModule, PagosComisionesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
