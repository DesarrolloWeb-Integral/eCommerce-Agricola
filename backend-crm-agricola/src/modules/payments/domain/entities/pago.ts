import { EstadoPago } from '../value-objects/estado-pago.enum'

export class Pago {
  constructor(
    public readonly id: string,
    public readonly pedidoId: string,
    public readonly clientId: string,
    public readonly producerProfileId: string,
    public readonly subtotal: number,
    public readonly comision: number,
    public readonly total: number,
    public readonly montoProductor: number,
    public estado: EstadoPago,
    public mercadoPagoPreferenceId: string | null,
    public mercadoPagoPaymentId: string | null,
    public readonly consentimientoExternoAceptadoEn: Date,
    public readonly creadoEn: Date,
    public actualizadoEn: Date
  ) {}

  marcarEnProceso(preferenceId: string): void {
    if (this.estado !== EstadoPago.PENDIENTE) {
      throw new Error('Solo un pago pendiente puede iniciar el checkout.')
    }

    this.estado = EstadoPago.EN_PROCESO
    this.mercadoPagoPreferenceId = preferenceId
    this.actualizadoEn = new Date()
  }

  aprobar(paymentId: string): void {
    if (this.estado !== EstadoPago.PENDIENTE && this.estado !== EstadoPago.EN_PROCESO) {
      throw new Error('El pago no puede aprobarse desde su estado actual.')
    }

    this.estado = EstadoPago.APROBADO
    this.mercadoPagoPaymentId = paymentId
    this.actualizadoEn = new Date()
  }

  rechazar(paymentId: string | null): void {
    if (this.estado !== EstadoPago.PENDIENTE && this.estado !== EstadoPago.EN_PROCESO) {
      throw new Error('El pago no puede rechazarse desde su estado actual.')
    }

    this.estado = EstadoPago.RECHAZADO
    this.mercadoPagoPaymentId = paymentId
    this.actualizadoEn = new Date()
  }

  cancelar(): void {
    if (this.estado !== EstadoPago.PENDIENTE && this.estado !== EstadoPago.EN_PROCESO) {
      throw new Error('El pago no puede cancelarse desde su estado actual.')
    }

    this.estado = EstadoPago.CANCELADO
    this.actualizadoEn = new Date()
  }
}
