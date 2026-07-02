import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

import { EstadoSolicitudArco } from '../../../../../domain/value-objects/estado-solicitud-arco.enum'
import { TipoSolicitudArco } from '../../../../../domain/value-objects/tipo-solicitud-arco.enum'

@Entity({ name: 'solicitudes_arco' })
export class SolicitudArcoEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'uuid', name: 'user_id' })
  userId!: string

  @Column({
    type: 'enum',
    enum: TipoSolicitudArco,
    enumName: 'tipo_solicitud_arco_enum',
  })
  type!: TipoSolicitudArco

  @Column({
    type: 'enum',
    enum: EstadoSolicitudArco,
    enumName: 'estado_solicitud_arco_enum',
    default: EstadoSolicitudArco.RECIBIDA,
  })
  status!: EstadoSolicitudArco

  @Column({ type: 'text', nullable: true })
  reason!: string | null

  @Column({ type: 'text', name: 'requested_data_description', nullable: true })
  requestedDataDescription!: string | null

  @Column({ type: 'text', nullable: true })
  response!: string | null

  @Column({ type: 'timestamp with time zone', name: 'requested_at' })
  requestedAt!: Date

  @Column({ type: 'timestamp with time zone', name: 'resolved_at', nullable: true })
  resolvedAt!: Date | null

  @Column({ type: 'uuid', name: 'resolved_by_user_id', nullable: true })
  resolvedByUserId!: string | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date
}
