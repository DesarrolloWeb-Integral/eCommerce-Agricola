import { IsString, MaxLength } from 'class-validator'

import { IsSafeText, IsTrimmedNotEmpty } from 'src/shared/validation/security.validators'

export class OposicionTransferenciasDto {
  @IsString()
  @IsTrimmedNotEmpty({ message: 'El motivo es obligatorio.' })
  @IsSafeText({ message: 'El motivo no puede contener HTML o JavaScript.' })
  @MaxLength(1000)
  reason!: string
}
