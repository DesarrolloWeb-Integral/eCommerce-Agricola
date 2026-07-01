import { Pago } from '../../../../../domain/entities/pago'
import { PagoEntity } from '../entities/pago.entity'

export class PagoMapper {
  static toDomain(entity: PagoEntity): Pago {
    return new Pago(
      entity.id,
      entity.pedidoId,
      entity.clientId,
      entity.producerProfileId,
      entity.subtotal,
      entity.comision,
      entity.total,
      entity.montoProductor,
      entity.estado,
      entity.mercadoPagoPreferenceId,
      entity.mercadoPagoPaymentId,
      entity.consentimientoExternoAceptadoEn,
      entity.creadoEn,
      entity.actualizadoEn
    )
  }

  static toEntity(pago: Pago): PagoEntity {
    const entity = new PagoEntity()

    entity.id = pago.id
    entity.pedidoId = pago.pedidoId
    entity.clientId = pago.clientId
    entity.producerProfileId = pago.producerProfileId
    entity.subtotal = pago.subtotal
    entity.comision = pago.comision
    entity.total = pago.total
    entity.montoProductor = pago.montoProductor
    entity.estado = pago.estado
    entity.mercadoPagoPreferenceId = pago.mercadoPagoPreferenceId
    entity.mercadoPagoPaymentId = pago.mercadoPagoPaymentId
    entity.consentimientoExternoAceptadoEn = pago.consentimientoExternoAceptadoEn
    entity.creadoEn = pago.creadoEn
    entity.actualizadoEn = pago.actualizadoEn

    return entity
  }
}
