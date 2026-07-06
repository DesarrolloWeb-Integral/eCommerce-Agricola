import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ChatController } from './adapters/in/http/controllers/chat.controller'
import { ConversacionEntity } from './adapters/out/persistence/typeorm/entities/conversacion.entity'
import { MensajeEntity } from './adapters/out/persistence/typeorm/entities/mensaje.entity'
import { TypeormConversacionRepository } from './adapters/out/persistence/typeorm/repositories/typeorm-conversacion.repository'
import { TypeormMensajeRepository } from './adapters/out/persistence/typeorm/repositories/typeorm-mensaje.repository'
import { CONVERSACION_REPOSITORY_PORT } from './ports/out/conversacion-repository.port'
import { MENSAJE_REPOSITORY_PORT } from './ports/out/mensaje-repository.port'
import { IniciarConversacionUseCase } from './application/use-cases/iniciar-conversacion.use-case'
import { EnviarMensajeUseCase } from './application/use-cases/enviar-mensaje.use-case'
import { ListarMensajesUseCase } from './application/use-cases/listar-mensajes.use-case'
import { ListarMisConversacionesUseCase } from './application/use-cases/listar-mis-conversaciones.use-case'
import { ProducerProfileModule } from 'src/producer-profile/producer-profile.module'
import { UsuariosModule } from 'src/modules/usuarios/usuarios.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([ConversacionEntity, MensajeEntity]),
    ProducerProfileModule,
    UsuariosModule,
  ],
  controllers: [ChatController],
  providers: [
    IniciarConversacionUseCase,
    EnviarMensajeUseCase,
    ListarMensajesUseCase,
    ListarMisConversacionesUseCase,
    { provide: CONVERSACION_REPOSITORY_PORT, useClass: TypeormConversacionRepository },
    { provide: MENSAJE_REPOSITORY_PORT, useClass: TypeormMensajeRepository },
  ],
})
export class ChatModule {}
