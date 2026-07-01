import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common'

import { CurrentUser } from 'src/modules/auth/adapters/in/http/decorators/current-user.decorator'
import { Roles } from 'src/modules/auth/adapters/in/http/decorators/roles.decorator'
import { JwtAuthGuard } from 'src/modules/auth/adapters/in/passport/jwt-auth.guard'
import { RolesGuard } from 'src/modules/auth/adapters/in/passport/roles.guard'
import type { UsuarioAutenticado } from 'src/modules/auth/domain/entities/usuario-autenticado'
import { RolUsuario } from 'src/modules/usuarios/domain/value-objects/rol-usuario.enum'
import { ObtenerResumenPagoUseCase } from '../../../../application/use-cases/obtener-resumen-pago.use-case'
import { PedidoIdParamDto } from '../dto/pedido-id-param.dto'
import { IniciarCheckoutPagoUseCase } from 'src/modules/payments/application/use-cases/iniciar-checkout-pago.use-case'
import { IniciarCheckoutDto } from '../dto/iniciar-checkout.dto'

@Controller('pagos')
export class PagosController {
  constructor(
    private readonly obtenerResumenPagoUseCase: ObtenerResumenPagoUseCase,
    private readonly iniciarCheckoutPagoUseCase: IniciarCheckoutPagoUseCase
  ) {}

  @Get('pedidos/:pedidoId/resumen')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.CLIENTE)
  async obtenerResumen(
    @Param() params: PedidoIdParamDto,
    @CurrentUser() usuarioAutenticado: UsuarioAutenticado
  ) {
    return this.obtenerResumenPagoUseCase.execute({
      pedidoId: params.pedidoId,
      clientId: usuarioAutenticado.id,
    })
  }

  @Post('pedidos/:pedidoId/checkout')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.CLIENTE)
  async iniciarCheckout(
    @Param() params: PedidoIdParamDto,
    @Body() dto: IniciarCheckoutDto,
    @CurrentUser() usuarioAutenticado: UsuarioAutenticado
  ) {
    return this.iniciarCheckoutPagoUseCase.execute({
      pedidoId: params.pedidoId,
      clientId: usuarioAutenticado.id,
      acceptedExternalPaymentConsent: dto.acceptedExternalPaymentConsent,
    })
  }
}
