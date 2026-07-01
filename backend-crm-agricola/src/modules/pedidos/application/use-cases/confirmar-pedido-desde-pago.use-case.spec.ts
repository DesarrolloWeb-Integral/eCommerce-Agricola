import { NotFoundException } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { ConfirmarPedidoDesdePagoUseCase } from './confirmar-pedido-desde-pago.use-case'
import { EstadoPedido } from '../../domain/value-objects/estado-pedido.enum'

describe('ConfirmarPedidoDesdePagoUseCase', () => {
  const findById = jest.fn()
  const findByClientId = jest.fn()
  const findByProducerProfileId = jest.fn()
  const save = jest.fn()
  const emit = jest.fn()

  const pedidoRepository = {
    findById,
    findByClientId,
    findByProducerProfileId,
    save,
  }

  const eventEmitter = {
    emit,
  } as unknown as EventEmitter2

  const useCase = new ConfirmarPedidoDesdePagoUseCase(pedidoRepository, eventEmitter)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('debe confirmar un pedido pendiente y emitir el evento', async () => {
    const pedido: {
      id: string
      estado: EstadoPedido
      confirmar: jest.Mock
    } = {
      id: 'pedido-id',
      estado: EstadoPedido.PENDIENTE,
      confirmar: jest.fn(() => {
        pedido.estado = EstadoPedido.CONFIRMADO
      }),
    }

    findById.mockResolvedValue(pedido)
    save.mockResolvedValue(pedido)

    await useCase.execute('pedido-id')

    expect(pedido.confirmar).toHaveBeenCalledTimes(1)
    expect(save).toHaveBeenCalledWith(pedido)
    expect(emit).toHaveBeenCalledWith('pedido.confirmado', pedido)
    expect(pedido.estado).toBe(EstadoPedido.CONFIRMADO)
  })

  it('no debe confirmar nuevamente un pedido ya confirmado', async () => {
    const confirmar = jest.fn()

    findById.mockResolvedValue({
      id: 'pedido-id',
      estado: EstadoPedido.CONFIRMADO,
      confirmar,
    })

    await useCase.execute('pedido-id')

    expect(confirmar).not.toHaveBeenCalled()
    expect(save).not.toHaveBeenCalled()
    expect(emit).not.toHaveBeenCalled()
  })

  it('debe fallar cuando el pedido no existe', async () => {
    findById.mockResolvedValue(null)

    await expect(useCase.execute('pedido-inexistente')).rejects.toBeInstanceOf(NotFoundException)

    expect(save).not.toHaveBeenCalled()
    expect(emit).not.toHaveBeenCalled()
  })
})
