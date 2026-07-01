import { Pago } from '../entities/pago'
import type { ComisionStrategy } from '../strategies/comision.strategy'
import { EstadoPago } from '../value-objects/estado-pago.enum'

export interface CrearPagoInput {
  id: string
  pedidoId: string
  clientId: string
  producerProfileId: string
  subtotal: number
  consentimientoExternoAceptadoEn: Date
  creadoEn?: Date
}

export class PagoFactory {
  constructor(private readonly comisionStrategy: ComisionStrategy) {}

  crear(input: CrearPagoInput): Pago {
    this.validarSubtotal(input.subtotal)

    const comision = this.comisionStrategy.calcular(input.subtotal)
    const total = input.subtotal
    const montoProductor = this.redondear(input.subtotal - comision)
    const creadoEn = input.creadoEn ?? new Date()

    return new Pago(
      input.id,
      input.pedidoId,
      input.clientId,
      input.producerProfileId,
      input.subtotal,
      comision,
      total,
      montoProductor,
      EstadoPago.PENDIENTE,
      null,
      null,
      input.consentimientoExternoAceptadoEn,
      creadoEn,
      creadoEn
    )
  }

  private validarSubtotal(subtotal: number): void {
    if (!Number.isFinite(subtotal) || subtotal <= 0) {
      throw new Error('El subtotal debe ser un número mayor a cero.')
    }
  }

  private redondear(valor: number): number {
    return Math.round((valor + Number.EPSILON) * 100) / 100
  }
}
