import { IsOptional, IsUUID, MaxLength } from 'class-validator'
import { IsSafeText, IsTrimmedNotEmpty } from 'src/shared/validation/security.validators'

export class IniciarConversacionDto {
  @IsUUID()
  producerProfileId!: string

  @IsOptional()
  @IsUUID()
  productoId?: string

  @IsOptional()
  @IsUUID()
  pedidoId?: string

  @IsTrimmedNotEmpty({ message: 'El mensaje no puede estar vacio.' })
  @IsSafeText({ message: 'El mensaje contiene caracteres o codigo no permitido.' })
  @MaxLength(2000, { message: 'El mensaje no puede superar los 2000 caracteres.' })
  mensaje!: string
}
