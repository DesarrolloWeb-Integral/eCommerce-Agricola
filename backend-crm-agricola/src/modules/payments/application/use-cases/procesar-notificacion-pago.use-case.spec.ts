import type { MercadoPagoPaymentPort } from '../../ports/out/mercado-pago-payment.port'
import type { PagoRepositoryPort } from '../../ports/out/pago-repository.port'
import type { PedidoConfirmacionPagoPort } from '../../ports/out/pedido-confirmacion-pago.port'
import { EstadoPago } from '../../domain/value-objects/estado-pago.enum'
import { ProcesarNotificacionPagoUseCase } from './procesar-notificacion-pago.use-case'
import { BadRequestException } from '@nestjs/common'

describe('ProcesarNotificacionPagoUseCase', () => {
  const obtenerPorId = jest.fn()
  const findById = jest.fn()
  const save = jest.fn()
  const confirmarPorPago = jest.fn()

  const mercadoPagoPayment = {
    obtenerPorId,
  } as unknown as MercadoPagoPaymentPort

  const pagoRepository = {
    findById,
    save,
  } as unknown as PagoRepositoryPort

  const pedidoConfirmacionPago = {
    confirmarPorPago,
  } as unknown as PedidoConfirmacionPagoPort

  const useCase = new ProcesarNotificacionPagoUseCase(
    mercadoPagoPayment,
    pagoRepository,
    pedidoConfirmacionPago
  )

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('debe aprobar el pago y confirmar el pedido cuando Mercado Pago lo reporta como approved', async () => {
    const aprobar = jest.fn()

    const pago = {
      id: 'pago-local-id',
      pedidoId: 'pedido-id',
      total: 750,
      estado: EstadoPago.EN_PROCESO,
      mercadoPagoPaymentId: null as string | null,
      aprobar,
    }

    aprobar.mockImplementation((paymentId: string) => {
      pago.estado = EstadoPago.APROBADO
      pago.mercadoPagoPaymentId = paymentId
    })

    obtenerPorId.mockResolvedValue({
      id: 'pago-mp-id',
      status: 'approved',
      externalReference: 'pago-local-id',
      transactionAmount: 750,
      currencyId: 'MXN',
    })

    findById.mockResolvedValue(pago)
    save.mockResolvedValue(pago)
    confirmarPorPago.mockResolvedValue(undefined)

    await useCase.execute('pago-mp-id')

    expect(obtenerPorId).toHaveBeenCalledWith('pago-mp-id')
    expect(findById).toHaveBeenCalledWith('pago-local-id')
    expect(aprobar).toHaveBeenCalledWith('pago-mp-id')
    expect(save).toHaveBeenCalledWith(pago)
    expect(confirmarPorPago).toHaveBeenCalledWith('pedido-id')
    expect(pago.estado).toBe(EstadoPago.APROBADO)
    expect(pago.mercadoPagoPaymentId).toBe('pago-mp-id')
  })

  it('debe rechazar el pago y no confirmar el pedido cuando Mercado Pago lo reporta como rejected', async () => {
    const rechazar = jest.fn()

    const pago = {
      id: 'pago-local-id',
      pedidoId: 'pedido-id',
      total: 750,
      estado: EstadoPago.EN_PROCESO,
      mercadoPagoPaymentId: null as string | null,
      rechazar,
    }

    rechazar.mockImplementation((paymentId: string) => {
      pago.estado = EstadoPago.RECHAZADO
      pago.mercadoPagoPaymentId = paymentId
    })

    obtenerPorId.mockResolvedValue({
      id: 'pago-mp-rechazado-id',
      status: 'rejected',
      externalReference: 'pago-local-id',
      transactionAmount: 750,
      currencyId: 'MXN',
    })

    findById.mockResolvedValue(pago)
    save.mockResolvedValue(pago)
    confirmarPorPago.mockResolvedValue(undefined)

    await useCase.execute('pago-mp-rechazado-id')

    expect(rechazar).toHaveBeenCalledWith('pago-mp-rechazado-id')
    expect(save).toHaveBeenCalledWith(pago)
    expect(confirmarPorPago).not.toHaveBeenCalled()
    expect(pago.estado).toBe(EstadoPago.RECHAZADO)
    expect(pago.mercadoPagoPaymentId).toBe('pago-mp-rechazado-id')
  })

  it('no debe guardar nuevamente un pago ya aprobado cuando recibe el mismo webhook', async () => {
    const pago = {
      id: 'pago-local-id',
      pedidoId: 'pedido-id',
      total: 1000,
      estado: EstadoPago.APROBADO,
      mercadoPagoPaymentId: 'pago-mp-id',
    }

    obtenerPorId.mockResolvedValue({
      id: 'pago-mp-id',
      status: 'approved',
      externalReference: 'pago-local-id',
      transactionAmount: 1000,
      currencyId: 'MXN',
    })

    findById.mockResolvedValue(pago)
    confirmarPorPago.mockResolvedValue(undefined)

    await useCase.execute('pago-mp-id')

    expect(save).not.toHaveBeenCalled()
    expect(confirmarPorPago).toHaveBeenCalledWith('pedido-id')
  })

  it('debe rechazar la notificación cuando el monto de Mercado Pago no coincide', async () => {
    const aprobar = jest.fn()

    const pago = {
      id: 'pago-local-id',
      pedidoId: 'pedido-id',
      total: 1000,
      estado: EstadoPago.EN_PROCESO,
      mercadoPagoPaymentId: null as string | null,
      aprobar,
    }

    obtenerPorId.mockResolvedValue({
      id: 'pago-mp-id',
      status: 'approved',
      externalReference: 'pago-local-id',
      transactionAmount: 999,
      currencyId: 'MXN',
    })

    findById.mockResolvedValue(pago)

    await expect(useCase.execute('pago-mp-id')).rejects.toBeInstanceOf(BadRequestException)

    expect(aprobar).not.toHaveBeenCalled()
    expect(save).not.toHaveBeenCalled()
    expect(confirmarPorPago).not.toHaveBeenCalled()
    expect(pago.estado).toBe(EstadoPago.EN_PROCESO)
  })
})
