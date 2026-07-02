import { IsIn, IsString, MaxLength } from 'class-validator'

import { EstadoSolicitudArco } from 'src/modules/solicitudes-arco/domain/value-objects/estado-solicitud-arco.enum'
import { IsSafeText, IsTrimmedNotEmpty } from 'src/shared/validation/security.validators'

export class ResolverSolicitudArcoDto {
  @IsIn([EstadoSolicitudArco.ATENDIDA, EstadoSolicitudArco.IMPROCEDENTE])
  status!: EstadoSolicitudArco.ATENDIDA | EstadoSolicitudArco.IMPROCEDENTE

  @IsString()
  @IsTrimmedNotEmpty({ message: 'La respuesta es obligatoria.' })
  @IsSafeText({ message: 'La respuesta no puede contener HTML o JavaScript.' })
  @MaxLength(2000)
  response!: string
}
