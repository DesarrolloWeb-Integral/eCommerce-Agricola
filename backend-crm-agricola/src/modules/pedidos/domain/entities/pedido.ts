import { EstadoPedido } from '../value-objects/estado-pedido.enum'

export interface PedidoItem {
  productId: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export class Pedido {
  constructor(
    public readonly id: string,
    public readonly clientId: string,
    public readonly producerProfileId: string,
    public readonly items: PedidoItem[],
    public readonly subtotal: number,
    public estado: EstadoPedido,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {}

  confirmar(): void {
    if (this.estado !== EstadoPedido.PENDIENTE) {
      throw new Error('Solo los pedidos pendientes pueden confirmarse.')
    }

    this.estado = EstadoPedido.CONFIRMADO
    this.updatedAt = new Date()
  }

  cancelar(): void {
    if (this.estado !== EstadoPedido.PENDIENTE) {
      throw new Error('Solo los pedidos pendientes pueden cancelarse.')
    }

    this.estado = EstadoPedido.CANCELADO
    this.updatedAt = new Date()
  }
}
