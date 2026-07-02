import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { PedidosModule } from '../pedidos/pedidos.module'
import { PedidoConsultaPagoAdapter } from './adapters/out/pedidos/pedido-consulta-pago.adapter'
import { PagoEntity } from './adapters/out/persistence/typeorm/entities/pago.entity'
import { TypeormPagoRepository } from './adapters/out/persistence/typeorm/repositories/typeorm-pago.repository'
import { ObtenerResumenPagoUseCase } from './application/use-cases/obtener-resumen-pago.use-case'
import { COMISION_STRATEGY, type ComisionStrategy } from './domain/strategies/comision.strategy'
import { ComisionPorcentajeFijoStrategy } from './domain/strategies/comision-porcentaje-fijo.strategy'
import { PAGO_REPOSITORY_PORT } from './ports/out/pago-repository.port'
import { PEDIDO_CONSULTA_PAGO_PORT } from './ports/out/pedido-consulta-pago.port'
import { PagosController } from './adapters/in/http/controllers/pagos.controller'
import { MercadoPagoCheckoutAdapter } from './adapters/out/mercado-pago/mercado-pago-checkout.adapter'
import { MERCADO_PAGO_CHECKOUT_PORT } from './ports/out/mercado-pago-checkout.port'
import { IniciarCheckoutPagoUseCase } from './application/use-cases/iniciar-checkout-pago.use-case'
import { MercadoPagoWebhookController } from './adapters/in/http/controllers/mercado-pago-webhook.controller'
import { MercadoPagoPaymentAdapter } from './adapters/out/mercado-pago/mercado-pago-payment.adapter'
import { MERCADO_PAGO_PAYMENT_PORT } from './ports/out/mercado-pago-payment.port'
import { PedidoConfirmacionPagoAdapter } from './adapters/out/pedidos/pedido-confirmacion-pago.adapter'
import { PEDIDO_CONFIRMACION_PAGO_PORT } from './ports/out/pedido-confirmacion-pago.port'
import { ProcesarNotificacionPagoUseCase } from './application/use-cases/procesar-notificacion-pago.use-case'
import { MercadoPagoWebhookSignatureAdapter } from './adapters/out/mercado-pago/mercado-pago-webhook-signature.adapter'
import { MERCADO_PAGO_WEBHOOK_SIGNATURE_PORT } from './ports/out/mercado-pago-webhook-signature.port'

@Module({
  imports: [TypeOrmModule.forFeature([PagoEntity]), PedidosModule],
  controllers: [PagosController, MercadoPagoWebhookController],
  providers: [
    ObtenerResumenPagoUseCase,
    IniciarCheckoutPagoUseCase,
    ProcesarNotificacionPagoUseCase,
    TypeormPagoRepository,
    PedidoConsultaPagoAdapter,
    PedidoConfirmacionPagoAdapter,
    MercadoPagoCheckoutAdapter,
    MercadoPagoPaymentAdapter,
    MercadoPagoWebhookSignatureAdapter,
    {
      provide: COMISION_STRATEGY,
      inject: [ConfigService],
      useFactory: (configService: ConfigService): ComisionStrategy => {
        const porcentaje = Number(
          configService.get<string>('PAYMENT_PLATFORM_COMMISSION_PERCENTAGE')
        )

        return new ComisionPorcentajeFijoStrategy(porcentaje)
      },
    },
    {
      provide: PAGO_REPOSITORY_PORT,
      useExisting: TypeormPagoRepository,
    },
    {
      provide: PEDIDO_CONSULTA_PAGO_PORT,
      useExisting: PedidoConsultaPagoAdapter,
    },
    {
      provide: PEDIDO_CONFIRMACION_PAGO_PORT,
      useExisting: PedidoConfirmacionPagoAdapter,
    },
    {
      provide: MERCADO_PAGO_CHECKOUT_PORT,
      useExisting: MercadoPagoCheckoutAdapter,
    },
    {
      provide: MERCADO_PAGO_PAYMENT_PORT,
      useExisting: MercadoPagoPaymentAdapter,
    },
    {
      provide: MERCADO_PAGO_WEBHOOK_SIGNATURE_PORT,
      useExisting: MercadoPagoWebhookSignatureAdapter,
    },
  ],
  exports: [PAGO_REPOSITORY_PORT],
})
export class PagosComisionesModule {}
