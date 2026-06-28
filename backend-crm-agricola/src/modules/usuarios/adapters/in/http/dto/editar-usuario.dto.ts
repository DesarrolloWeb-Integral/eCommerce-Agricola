import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator'

export class EditarUsuarioDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName!: string

  @IsOptional()
  @IsEmail()
  @MaxLength(150)
  email!: string

  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{10}$/, {
    message: 'El teléfono debe contener exactamente 10 dígitos.',
  })
  phone!: string
}
