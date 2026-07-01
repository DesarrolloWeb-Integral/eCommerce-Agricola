import { IsUUID } from 'class-validator'

export class PedidoIdParamDto {
  @IsUUID('4', {
    message: 'El identificador del pedido debe ser un UUID válido.',
  })
  id!: string
}
