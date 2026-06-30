import type { PedidoItem } from '../entities/pedido'

export class PedidoConfirmadoEvent {
  constructor(
    public readonly pedidoId: string,
    public readonly clientId: string,
    public readonly producerProfileId: string,
    public readonly items: PedidoItem[],
    public readonly subtotal: number,
    public readonly confirmedAt: Date
  ) {}
}
