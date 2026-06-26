import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator'

export class EditarUsuarioDto {
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
}
