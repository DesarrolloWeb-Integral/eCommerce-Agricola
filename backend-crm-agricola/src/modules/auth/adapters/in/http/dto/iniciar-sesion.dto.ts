import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator'

export class IniciarSesionDto {
  @IsEmail(
    {},
    {
      message: 'El correo electrónico no tiene un formato válido.',
    }
  )
  @MaxLength(150)
  email!: string

  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password!: string
}
