import { BadRequestException, ForbiddenException } from '@nestjs/common'

import { EstadoPedido } from '../../../pedidos/domain/value-objects/estado-pedido.enum'
import { ComisionPorcentajeFijoStrategy } from '../../domain/strategies/comision-porcentaje-fijo.strategy'
import type { PedidoConsultaPagoPort } from '../../ports/out/pedido-consulta-pago.port'
import { ObtenerResumenPagoUseCase } from './obtener-resumen-pago.use-case'

describe('ObtenerResumenPagoUseCase', () => {
  const findById = jest.fn()

  const pedidoConsulta: PedidoConsultaPagoPort = {
    findById,
  }

  const useCase = new ObtenerResumenPagoUseCase(
    pedidoConsulta,
    new ComisionPorcentajeFijoStrategy(10)
  )

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('debe calcular el resumen desde el pedido del cliente autenticado', async () => {
    findById.mockResolvedValue({
      id: 'pedido-id',
      clientId: 'cliente-id',
      producerProfileId: 'perfil-productor-id',
      subtotal: 230,
      estado: EstadoPedido.PENDIENTE,
    })

    const resumen = await useCase.execute({
      pedidoId: 'pedido-id',
      clientId: 'cliente-id',
    })

    expect(resumen).toEqual({
      pedidoId: 'pedido-id',
      subtotal: 230,
      comision: 23,
      total: 230,
      montoProductor: 207,
    })
  })

  it('debe rechazar la consulta de un pedido perteneciente a otro cliente', async () => {
    findById.mockResolvedValue({
      id: 'pedido-id',
      clientId: 'cliente-dueno-id',
      producerProfileId: 'perfil-productor-id',
      subtotal: 230,
      estado: EstadoPedido.PENDIENTE,
    })

    await expect(
      useCase.execute({
        pedidoId: 'pedido-id',
        clientId: 'otro-cliente-id',
      })
    ).rejects.toThrow(ForbiddenException)
  })

  it('debe rechazar un pedido que ya no está pendiente', async () => {
    findById.mockResolvedValue({
      id: 'pedido-id',
      clientId: 'cliente-id',
      producerProfileId: 'perfil-productor-id',
      subtotal: 230,
      estado: EstadoPedido.CONFIRMADO,
    })

    await expect(
      useCase.execute({
        pedidoId: 'pedido-id',
        clientId: 'cliente-id',
      })
    ).rejects.toThrow(BadRequestException)
  })
})
