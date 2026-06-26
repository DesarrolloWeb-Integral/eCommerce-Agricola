import { IsEmail, IsIn, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator'
import { RolUsuario } from 'src/modules/usuarios/domain/value-objects/rol-usuario.enum'

export class RegistrarUsuarioDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName!: string

  @IsEmail()
  @MaxLength(150)
  email!: string

  @IsString()
  @Matches(/^[0-9]{10}$/, {
    message: 'El teléfono debe contener exactamente 10 dígitos.',
  })
  phone!: string

  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password!: string

  @IsIn([RolUsuario.CLIENTE, RolUsuario.PROVEEDOR], {
    message: 'El rol debe ser CLIENTE o PROVEEDOR.',
  })
  role!: RolUsuario
}
