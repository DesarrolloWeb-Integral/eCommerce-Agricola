import { IsEmail, IsOptional, IsString, Matches, MaxLength } from 'class-validator'
import {
  IsOptionalButNotNull,
  IsSafeText,
  IsTrimmedNotEmpty,
} from 'src/shared/validation/security.validators'

export class EditarUsuarioDto {
  @IsOptionalButNotNull()
  @IsString()
  @IsTrimmedNotEmpty({ message: 'El nombre no puede estar vacio.' })
  @IsSafeText({ message: 'El nombre no puede contener HTML o JavaScript.' })
  @MaxLength(100)
  name!: string

  @IsOptionalButNotNull()
  @IsString()
  @IsTrimmedNotEmpty({ message: 'El apellido no puede estar vacio.' })
  @IsSafeText({ message: 'El apellido no puede contener HTML o JavaScript.' })
  @MaxLength(100)
  lastName!: string

  @IsOptionalButNotNull()
  @IsEmail()
  @MaxLength(150)
  email!: string

  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{10}$/, {
    message: 'El teléfono debe contener exactamente 10 dígitos.',
  })
  phone?: string | null
}
