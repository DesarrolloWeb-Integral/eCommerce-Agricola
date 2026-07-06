import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { CurrentUser } from 'src/modules/auth/adapters/in/http/decorators/current-user.decorator'
import { JwtAuthGuard } from 'src/modules/auth/adapters/in/passport/jwt-auth.guard'
import type { UsuarioAutenticado } from 'src/modules/auth/domain/entities/usuario-autenticado'
import { RolUsuario } from 'src/modules/usuarios/domain/value-objects/rol-usuario.enum'
import {
  USUARIO_REPOSITORY_PORT,
  type UsuarioRepositoryPort,
} from 'src/modules/usuarios/ports/out/usuario-repository.port'
import { ProducerProfileService } from 'src/producer-profile/producer-profile.service'
import { IniciarConversacionUseCase } from '../../../../application/use-cases/iniciar-conversacion.use-case'
import { EnviarMensajeUseCase } from '../../../../application/use-cases/enviar-mensaje.use-case'
import { ListarMensajesUseCase } from '../../../../application/use-cases/listar-mensajes.use-case'
import { ListarMisConversacionesUseCase } from '../../../../application/use-cases/listar-mis-conversaciones.use-case'
import { IniciarConversacionDto } from '../dto/iniciar-conversacion.dto'
import { EnviarMensajeDto } from '../dto/enviar-mensaje.dto'
import { ConversacionIdParamDto } from '../dto/conversacion-id-param.dto'
import type { Conversacion } from '../../../../domain/entities/conversacion'
import type { Mensaje } from '../../../../domain/entities/mensaje'

interface ConversacionResponse {
  id: string
  producerProfileId: string
  producerBusinessName: string
  clienteLabel?: string
  productoId: string | null
  pedidoId: string | null
  createdAt: Date
  updatedAt: Date
}

interface MensajeResponse {
  id: string
  remitenteId: string
  contenido: string
  createdAt: Date
}

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(
    private readonly iniciarConversacionUseCase: IniciarConversacionUseCase,
    private readonly enviarMensajeUseCase: EnviarMensajeUseCase,
    private readonly listarMensajesUseCase: ListarMensajesUseCase,
    private readonly listarMisConversacionesUseCase: ListarMisConversacionesUseCase,
    private readonly producerProfileService: ProducerProfileService,

    @Inject(USUARIO_REPOSITORY_PORT)
    private readonly usuarioRepository: UsuarioRepositoryPort
  ) {}

  @Post('conversaciones')
  @HttpCode(HttpStatus.CREATED)
  async iniciarConversacion(
    @Body() dto: IniciarConversacionDto,
    @CurrentUser() usuarioAutenticado: UsuarioAutenticado
  ): Promise<ConversacionResponse> {
    const conversacion = await this.iniciarConversacionUseCase.execute({
      clienteId: usuarioAutenticado.id,
      producerProfileId: dto.producerProfileId,
      productoId: dto.productoId ?? null,
      pedidoId: dto.pedidoId ?? null,
      mensajeInicial: dto.mensaje,
    })

    return this.toConversacionResponse(conversacion)
  }

  @Get('conversaciones')
  async listarMisConversaciones(
    @CurrentUser() usuarioAutenticado: UsuarioAutenticado
  ): Promise<ConversacionResponse[]> {
    const conversaciones = await this.listarMisConversacionesUseCase.execute({
      usuarioId: usuarioAutenticado.id,
      rol: usuarioAutenticado.role,
    })

    const esProductor = usuarioAutenticado.role === RolUsuario.PROVEEDOR

    return Promise.all(
      conversaciones.map((c) =>
        this.toConversacionResponse(c, { includeClienteLabel: esProductor })
      )
    )
  }

  @Post('conversaciones/:id/mensajes')
  @HttpCode(HttpStatus.CREATED)
  async enviarMensaje(
    @Param() params: ConversacionIdParamDto,
    @Body() dto: EnviarMensajeDto,
    @CurrentUser() usuarioAutenticado: UsuarioAutenticado
  ): Promise<MensajeResponse> {
    const mensaje = await this.enviarMensajeUseCase.execute({
      conversacionId: params.id,
      remitenteId: usuarioAutenticado.id,
      contenido: dto.contenido,
    })

    return this.toMensajeResponse(mensaje)
  }

  @Get('conversaciones/:id/mensajes')
  async listarMensajes(
    @Param() params: ConversacionIdParamDto,
    @CurrentUser() usuarioAutenticado: UsuarioAutenticado
  ): Promise<MensajeResponse[]> {
    const mensajes = await this.listarMensajesUseCase.execute({
      conversacionId: params.id,
      usuarioId: usuarioAutenticado.id,
    })

    return mensajes.map((m) => this.toMensajeResponse(m))
  }

  private async toConversacionResponse(
    conversacion: Conversacion,
    options: { includeClienteLabel?: boolean } = {}
  ): Promise<ConversacionResponse> {
    const perfilProductor = await this.producerProfileService.findPublicById(
      conversacion.producerProfileId
    )

    const response: ConversacionResponse = {
      id: conversacion.id,
      producerProfileId: conversacion.producerProfileId,
      producerBusinessName: perfilProductor.businessName,
      productoId: conversacion.productoId,
      pedidoId: conversacion.pedidoId,
      createdAt: conversacion.createdAt,
      updatedAt: conversacion.updatedAt,
    }

    if (options.includeClienteLabel) {
      response.clienteLabel = await this.getClienteLabel(conversacion.clienteId)
    }

    return response
  }

  private async getClienteLabel(clienteId: string): Promise<string> {
    const usuario = await this.usuarioRepository.findById(clienteId)

    return usuario?.isCancelled() ? 'Cliente no disponible' : 'Cliente registrado'
  }

  private toMensajeResponse(mensaje: Mensaje): MensajeResponse {
    return {
      id: mensaje.id,
      remitenteId: mensaje.remitenteId,
      contenido: mensaje.contenido,
      createdAt: mensaje.createdAt,
    }
  }
}
