import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator'
import { CategoriaProducto } from '../../../../domain/value-objects/categoria-producto.enum'

export class RegistrarProductoDto {
  @IsString({ message: 'El nombre debe ser texto.' })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @MaxLength(150, { message: 'El nombre no puede superar los 150 caracteres.' })
  nombre!: string

  @IsString({ message: 'La descripción debe ser texto.' })
  @IsNotEmpty({ message: 'La descripción es obligatoria.' })
  @MaxLength(1000, { message: 'La descripción no puede superar los 1000 caracteres.' })
  descripcion!: string

  @IsEnum(CategoriaProducto, { message: 'La categoría no es válida.' })
  categoria!: CategoriaProducto

  @IsNumber({}, { message: 'El precio debe ser un número.' })
  @Min(0.01, { message: 'El precio debe ser mayor a cero.' })
  precio!: number

  @IsNumber({}, { message: 'La cantidad debe ser un número.' })
  @Min(0, { message: 'La cantidad no puede ser negativa.' })
  cantidad!: number

  @IsOptional()
  @IsBoolean({ message: 'La disponibilidad debe ser verdadero o falso.' })
  disponible?: boolean
}
