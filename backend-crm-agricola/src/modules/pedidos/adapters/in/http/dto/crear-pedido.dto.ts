import { Type } from 'class-transformer'
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator'

export class CrearPedidoItemDto {
  @IsUUID('4', {
    message: 'El identificador del producto debe ser un UUID valido.',
  })
  productId!: string

  @IsInt({
    message: 'La cantidad debe ser un numero entero.',
  })
  @Min(1, {
    message: 'La cantidad debe ser mayor a cero.',
  })
  quantity!: number
}

export class CrearPedidoDto {
  @IsArray({
    message: 'Los productos del pedido deben enviarse como una lista.',
  })
  @ArrayMinSize(1, {
    message: 'El pedido debe incluir al menos un producto.',
  })
  @ArrayMaxSize(50, {
    message: 'El pedido no puede incluir mas de 50 productos.',
  })
  @ValidateNested({ each: true })
  @Type(() => CrearPedidoItemDto)
  items!: CrearPedidoItemDto[]
}
