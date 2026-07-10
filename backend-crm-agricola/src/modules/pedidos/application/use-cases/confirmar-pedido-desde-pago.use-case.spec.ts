import { NotFoundException } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { ConfirmarPedidoDesdePagoUseCase } from './confirmar-pedido-desde-pago.use-case'
import { EstadoPedido } from '../../domain/value-objects/estado-pedido.enum'
import { RegistrarLogUseCase } from '../../../auditoria/application/use-cases/registrar-log.use-case'

describe('ConfirmarPedidoDesdePagoUseCase', () => {
  const findById = jest.fn()
  const findByClientId = jest.fn()
  const findByProducerProfileId = jest.fn()
  const save = jest.fn()
  const emit = jest.fn()
  const registrarLog = jest.fn()

  const pedidoRepository = {
    findById,
    findByClientId,
    findByProducerProfileId,
    save,
  }

  const eventEmitter = {
    emit,
  } as unknown as EventEmitter2

  const registrarLogUseCase = {
    execute: registrarLog,
  } as unknown as RegistrarLogUseCase

  const useCase = new ConfirmarPedidoDesdePagoUseCase(
    pedidoRepository,
    eventEmitter,
    registrarLogUseCase
  )

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('debe confirmar un pedido pendiente, emitir el evento y registrar el log', async () => {
    const pedido: {
      id: string
      clientId: string
      estado: EstadoPedido
      confirmar: jest.Mock
    } = {
      id: 'pedido-id',
      clientId: 'cliente-id',
      estado: EstadoPedido.PENDIENTE,
      confirmar: jest.fn(() => {
        pedido.estado = EstadoPedido.CONFIRMADO
      }),
    }

    findById.mockResolvedValue(pedido)
    save.mockResolvedValue(pedido)
    registrarLog.mockResolvedValue(undefined)

    await useCase.execute('pedido-id')

    expect(pedido.confirmar).toHaveBeenCalledTimes(1)
    expect(save).toHaveBeenCalledWith(pedido)
    expect(emit).toHaveBeenCalledWith('pedido.confirmado', pedido)
    expect(pedido.estado).toBe(EstadoPedido.CONFIRMADO)

    expect(registrarLog).toHaveBeenCalledWith(
      expect.objectContaining({
        usuarioId: 'cliente-id',
        accion: 'CAMBIO_ESTADO_PEDIDO',
        recursoAfectado: 'Pedido:pedido-id',
      })
    )
  })

  it('no debe confirmar nuevamente un pedido ya confirmado', async () => {
    const confirmar = jest.fn()

    findById.mockResolvedValue({
      id: 'pedido-id',
      clientId: 'cliente-id',
      estado: EstadoPedido.CONFIRMADO,
      confirmar,
    })

    await useCase.execute('pedido-id')

    expect(confirmar).not.toHaveBeenCalled()
    expect(save).not.toHaveBeenCalled()
    expect(emit).not.toHaveBeenCalled()
    expect(registrarLog).not.toHaveBeenCalled()
  })

  it('debe fallar cuando el pedido no existe', async () => {
    findById.mockResolvedValue(null)

    await expect(useCase.execute('pedido-inexistente')).rejects.toBeInstanceOf(NotFoundException)

    expect(save).not.toHaveBeenCalled()
    expect(emit).not.toHaveBeenCalled()
    expect(registrarLog).not.toHaveBeenCalled()
  })
})
