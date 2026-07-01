import { Pedido, type PedidoItem } from '../entities/pedido'
import { EstadoPedido } from '../value-objects/estado-pedido.enum'

export interface CrearPedidoFactoryItemInput {
  productId: string
  quantity: number
  unitPrice: number
}

export interface CrearPedidoFactoryInput {
  id: string
  clientId: string
  producerProfileId: string
  items: CrearPedidoFactoryItemInput[]
  createdAt?: Date
}

export class PedidoFactory {
  static crear(input: CrearPedidoFactoryInput): Pedido {
    this.validarItems(input.items)

    const createdAt = input.createdAt ?? new Date()
    const items = input.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      subtotal: this.calcularSubtotal(item.quantity, item.unitPrice),
    }))
    const subtotal = this.calcularTotal(items)

    return new Pedido(
      input.id,
      input.clientId,
      input.producerProfileId,
      items,
      subtotal,
      EstadoPedido.PENDIENTE,
      createdAt,
      createdAt
    )
  }

  private static validarItems(items: CrearPedidoFactoryItemInput[]): void {
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('El pedido debe incluir al menos un producto.')
    }

    for (const item of items) {
      this.validarCantidad(item.quantity)
      this.validarPrecioUnitario(item.unitPrice)
    }
  }

  private static validarCantidad(quantity: number): void {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error('La cantidad del pedido debe ser un numero entero mayor a cero.')
    }
  }

  private static validarPrecioUnitario(unitPrice: number): void {
    if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
      throw new Error('El precio unitario debe ser un numero mayor a cero.')
    }
  }

  private static calcularSubtotal(quantity: number, unitPrice: number): number {
    return Math.round((quantity * unitPrice + Number.EPSILON) * 100) / 100
  }

  private static calcularTotal(items: PedidoItem[]): number {
    const total = items.reduce((sum, item) => sum + item.subtotal, 0)

    return Math.round((total + Number.EPSILON) * 100) / 100
  }
}
