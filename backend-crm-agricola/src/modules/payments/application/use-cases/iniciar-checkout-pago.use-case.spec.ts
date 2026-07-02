import { BadRequestException } from '@nestjs/common'

import { EstadoPedido } from '../../../pedidos/domain/value-objects/estado-pedido.enum'
import { EstadoPago } from '../../domain/value-objects/estado-pago.enum'
import type { Pago } from '../../domain/entities/pago'
import { ComisionPorcentajeFijoStrategy } from '../../domain/strategies/comision-porcentaje-fijo.strategy'
import type {
  CheckoutMercadoPago,
  CrearCheckoutMercadoPagoInput,
  MercadoPagoCheckoutPort,
} from '../../ports/out/mercado-pago-checkout.port'
import type { PagoRepositoryPort } from '../../ports/out/pago-repository.port'
import type {
  PedidoConsultaPagoPort,
  PedidoParaPago,
} from '../../ports/out/pedido-consulta-pago.port'
import {
  IniciarCheckoutPagoUseCase,
  type IniciarCheckoutPagoResult,
} from './iniciar-checkout-pago.use-case'

describe('IniciarCheckoutPagoUseCase', () => {
  const findPedidoById = jest.fn<Promise<PedidoParaPago | null>, [string]>()
  const savePago = jest.fn<Promise<Pago>, [Pago]>()
  const findPagoById = jest.fn<Promise<Pago | null>, [string]>()
  const findPagoByPedidoId = jest.fn<Promise<Pago | null>, [string]>()
  const findPagoByMercadoPagoPaymentId = jest.fn<Promise<Pago | null>, [string]>()
  const findPagosByClientId = jest.fn<Promise<Pago[]>, [string]>()
  const findPagosByProducerProfileId = jest.fn<Promise<Pago[]>, [string]>()
  const findPagosByClientIdAndEstados = jest.fn<Promise<Pago[]>, [string, EstadoPago[]]>()
  const findPagosByProducerProfileIdAndEstados = jest.fn<Promise<Pago[]>, [string, EstadoPago[]]>()
  const crearCheckout = jest.fn<Promise<CheckoutMercadoPago>, [CrearCheckoutMercadoPagoInput]>()

  const pedidoConsulta: PedidoConsultaPagoPort = {
    findById: findPedidoById,
  }

  const pagoRepository: PagoRepositoryPort = {
    save: savePago,
    findById: findPagoById,
    findByPedidoId: findPagoByPedidoId,
    findByMercadoPagoPaymentId: findPagoByMercadoPagoPaymentId,
    findByClientId: findPagosByClientId,
    findByProducerProfileId: findPagosByProducerProfileId,
    findByClientIdAndEstados: findPagosByClientIdAndEstados,
    findByProducerProfileIdAndEstados: findPagosByProducerProfileIdAndEstados,
  }

  const mercadoPagoCheckout: MercadoPagoCheckoutPort = {
    crearCheckout,
  }

  const useCase = new IniciarCheckoutPagoUseCase(
    pedidoConsulta,
    pagoRepository,
    new ComisionPorcentajeFijoStrategy(10),
    mercadoPagoCheckout
  )

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('debe rechazar el inicio del checkout sin consentimiento', async () => {
    await expect(
      useCase.execute({
        pedidoId: 'pedido-id',
        clientId: 'cliente-id',
        acceptedExternalPaymentConsent: false,
      })
    ).rejects.toThrow(BadRequestException)

    expect(findPedidoById).not.toHaveBeenCalled()
    expect(savePago).not.toHaveBeenCalled()
    expect(crearCheckout).not.toHaveBeenCalled()
  })

  it('debe crear el pago y devolver la URL de checkout', async () => {
    findPedidoById.mockResolvedValue({
      id: 'pedido-id',
      clientId: 'cliente-id',
      producerProfileId: 'perfil-productor-id',
      subtotal: 750,
      estado: EstadoPedido.PENDIENTE,
    })

    findPagoByPedidoId.mockResolvedValue(null)

    savePago.mockImplementation((pago) => Promise.resolve(pago))

    crearCheckout.mockResolvedValue({
      preferenceId: 'preferencia-mp-id',
      checkoutUrl: 'https://sandbox.mercadopago.com.mx/checkout/test',
    })

    const resultado: IniciarCheckoutPagoResult = await useCase.execute({
      pedidoId: 'pedido-id',
      clientId: 'cliente-id',
      acceptedExternalPaymentConsent: true,
    })

    expect(crearCheckout).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Pedido agrícola',
        total: 750,
      })
    )

    expect(savePago).toHaveBeenCalledTimes(2)

    expect(typeof resultado.pagoId).toBe('string')
    expect(resultado.pagoId.length).toBeGreaterThan(0)
    expect(resultado.subtotal).toBe(750)
    expect(resultado.comision).toBe(75)
    expect(resultado.total).toBe(750)
    expect(resultado.montoProductor).toBe(675)
    expect(resultado.checkoutUrl).toBe('https://sandbox.mercadopago.com.mx/checkout/test')
  })
})
