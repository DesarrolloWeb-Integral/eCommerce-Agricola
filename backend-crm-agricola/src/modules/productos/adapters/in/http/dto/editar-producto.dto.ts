import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator'
import { CategoriaProducto } from '../../../../domain/value-objects/categoria-producto.enum'

export class EditarProductoDto {
  @IsOptional()
  @IsString({ message: 'El nombre debe ser texto.' })
  @MaxLength(150, { message: 'El nombre no puede superar los 150 caracteres.' })
  nombre?: string

  @IsOptional()
  @IsString({ message: 'La descripción debe ser texto.' })
  @MaxLength(1000, { message: 'La descripción no puede superar los 1000 caracteres.' })
  descripcion?: string

  @IsOptional()
  @IsEnum(CategoriaProducto, { message: 'La categoría no es válida.' })
  categoria?: CategoriaProducto

  @IsOptional()
  @IsNumber({}, { message: 'El precio debe ser un número.' })
  @Min(0.01, { message: 'El precio debe ser mayor a cero.' })
  precio?: number

  @IsOptional()
  @IsNumber({}, { message: 'La cantidad debe ser un número.' })
  @Min(0, { message: 'La cantidad no puede ser negativa.' })
  cantidad?: number

  @IsOptional()
  @IsBoolean({ message: 'La disponibilidad debe ser verdadero o falso.' })
  disponible?: boolean
}
