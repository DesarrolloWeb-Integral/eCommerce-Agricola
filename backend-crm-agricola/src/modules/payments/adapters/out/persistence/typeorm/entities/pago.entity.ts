import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

import { EstadoPago } from '../../../../../domain/value-objects/estado-pago.enum'

const numericTransformer = {
  to: (value: number): number => value,
  from: (value: string): number => Number(value),
}

@Entity({ name: 'agro_pago' })
export class PagoEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'uuid', name: 'pedido_id', unique: true })
  pedidoId!: string

  @Column({ type: 'uuid', name: 'client_id' })
  clientId!: string

  @Column({ type: 'uuid', name: 'producer_profile_id' })
  producerProfileId!: string

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    transformer: numericTransformer,
  })
  subtotal!: number

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    transformer: numericTransformer,
  })
  comision!: number

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    transformer: numericTransformer,
  })
  total!: number

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    name: 'monto_productor',
    transformer: numericTransformer,
  })
  montoProductor!: number

  @Column({
    type: 'enum',
    enum: EstadoPago,
    enumName: 'estado_pago_enum',
    default: EstadoPago.PENDIENTE,
  })
  estado!: EstadoPago

  @Column({
    type: 'varchar',
    name: 'mercado_pago_preference_id',
    nullable: true,
    unique: true,
  })
  mercadoPagoPreferenceId!: string | null

  @Column({
    type: 'varchar',
    name: 'mercado_pago_payment_id',
    nullable: true,
    unique: true,
  })
  mercadoPagoPaymentId!: string | null

  @Column({
    type: 'timestamp with time zone',
    name: 'consentimiento_externo_aceptado_en',
  })
  consentimientoExternoAceptadoEn!: Date

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn!: Date

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn!: Date
}
