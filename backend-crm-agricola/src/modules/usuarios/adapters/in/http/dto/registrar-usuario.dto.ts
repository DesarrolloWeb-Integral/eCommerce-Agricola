import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator'
import { IsSafeText, IsTrimmedNotEmpty } from 'src/shared/validation/security.validators'
import { RolUsuario } from 'src/modules/usuarios/domain/value-objects/rol-usuario.enum'

export class RegistrarUsuarioDto {
  @IsString()
  @IsTrimmedNotEmpty({ message: 'El nombre es obligatorio.' })
  @IsSafeText({ message: 'El nombre no puede contener HTML o JavaScript.' })
  @MaxLength(100)
  name!: string

  @IsString()
  @IsTrimmedNotEmpty({ message: 'El apellido es obligatorio.' })
  @IsSafeText({ message: 'El apellido no puede contener HTML o JavaScript.' })
  @MaxLength(100)
  lastName!: string

  @IsEmail()
  @MaxLength(150)
  email!: string

  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{10}$/, {
    message: 'El teléfono debe contener exactamente 10 dígitos.',
  })
  phone?: string | null

  @IsString()
  @IsTrimmedNotEmpty({ message: 'La contraseña es obligatoria.' })
  @MinLength(8)
  @MaxLength(72)
  password!: string

  @IsIn([RolUsuario.CLIENTE, RolUsuario.PROVEEDOR], {
    message: 'El rol debe ser CLIENTE o PROVEEDOR.',
  })
  role!: RolUsuario

  @IsBoolean({ message: 'Debes aceptar el Aviso de Privacidad.' })
  privacyNoticeAccepted!: boolean
}
