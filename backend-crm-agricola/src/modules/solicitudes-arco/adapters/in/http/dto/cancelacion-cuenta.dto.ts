import { IsBoolean, IsString, MaxLength, MinLength } from 'class-validator'

import { IsTrimmedNotEmpty } from 'src/shared/validation/security.validators'

export class CancelacionCuentaDto {
  @IsString()
  @IsTrimmedNotEmpty({ message: 'La contrasena actual es obligatoria.' })
  @MinLength(8)
  @MaxLength(72)
  currentPassword!: string

  @IsBoolean({ message: 'Debes confirmar la cancelacion.' })
  confirmCancellation!: boolean
}
