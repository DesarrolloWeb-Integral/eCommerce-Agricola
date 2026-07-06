import { IsSafeText, IsTrimmedNotEmpty } from 'src/shared/validation/security.validators'
import { MaxLength } from 'class-validator'

export class EnviarMensajeDto {
  @IsTrimmedNotEmpty({ message: 'El mensaje no puede estar vacio.' })
  @IsSafeText({ message: 'El mensaje contiene caracteres o codigo no permitido.' })
  @MaxLength(2000, { message: 'El mensaje no puede superar los 2000 caracteres.' })
  contenido!: string
}
