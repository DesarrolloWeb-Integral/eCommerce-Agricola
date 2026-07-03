import { PagoFactory } from './pago.factory'
import { ComisionPorcentajeFijoStrategy } from '../strategies/comision-porcentaje-fijo.strategy'
import { EstadoPago } from '../value-objects/estado-pago.enum'

describe('PagoFactory', () => {
  const factory = new PagoFactory(new ComisionPorcentajeFijoStrategy(10))

  it('debe crear un pago calculando la comisión para el productor', () => {
    const pago = factory.crear({
      id: 'pago-id',
      pedidoId: 'pedido-id',
      clientId: 'cliente-id',
      producerProfileId: 'perfil-productor-id',
      subtotal: 100,
      proveedorExterno: 'MERCADO_PAGO',
      consentimientoExternoVersion: 'MERCADO_PAGO_TRANSFER_V1',
      consentimientoExternoAceptadoEn: new Date('2026-07-01T10:00:00.000Z'),
      creadoEn: new Date('2026-07-01T10:00:00.000Z'),
    })

    expect(pago.subtotal).toBe(100)
    expect(pago.comision).toBe(10)
    expect(pago.total).toBe(100)
    expect(pago.montoProductor).toBe(90)
    expect(pago.estado).toBe(EstadoPago.PENDIENTE)
    expect(pago.mercadoPagoPreferenceId).toBeNull()
    expect(pago.mercadoPagoPaymentId).toBeNull()
    expect(pago.proveedorExterno).toBe('MERCADO_PAGO')
    expect(pago.consentimientoExternoVersion).toBe('MERCADO_PAGO_TRANSFER_V1')
  })

  it('debe rechazar un subtotal inválido', () => {
    expect(() =>
      factory.crear({
        id: 'pago-id',
        pedidoId: 'pedido-id',
        clientId: 'cliente-id',
        producerProfileId: 'perfil-productor-id',
        proveedorExterno: 'MERCADO_PAGO',
        consentimientoExternoVersion: 'MERCADO_PAGO_TRANSFER_V1',
        consentimientoExternoAceptadoEn: new Date('2026-07-01T10:00:00.000Z'),
        subtotal: 0,
      })
    ).toThrow('El subtotal debe ser un número mayor a cero.')
  })
})
