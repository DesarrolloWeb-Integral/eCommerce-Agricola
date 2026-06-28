import { IsJWT } from 'class-validator'

export class CerrarSesionDto {
  @IsJWT({
    message: 'El refresh token no tiene un formato válido.',
  })
  refreshToken!: string
}
