import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
} from 'class-validator'
import {
  IsOptionalButNotNull,
  IsSafeText,
  IsTrimmedNotEmpty,
} from 'src/shared/validation/security.validators'
import { CategoriaProducto } from '../../../../domain/value-objects/categoria-producto.enum'

export class RegistrarProductoDto {
  @IsString({ message: 'El nombre debe ser texto.' })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @IsTrimmedNotEmpty({ message: 'El nombre es obligatorio.' })
  @IsSafeText({ message: 'El nombre no puede contener HTML o JavaScript.' })
  @MaxLength(150, { message: 'El nombre no puede superar los 150 caracteres.' })
  nombre!: string

  @IsString({ message: 'La descripción debe ser texto.' })
  @IsNotEmpty({ message: 'La descripción es obligatoria.' })
  @IsTrimmedNotEmpty({ message: 'La descripción es obligatoria.' })
  @IsSafeText({ message: 'La descripción no puede contener HTML o JavaScript.' })
  @MaxLength(1000, { message: 'La descripción no puede superar los 1000 caracteres.' })
  descripcion!: string

  @IsEnum(CategoriaProducto, { message: 'La categoría no es válida.' })
  categoria!: CategoriaProducto

  @IsNumber({}, { message: 'El precio debe ser un número.' })
  @Min(0.01, { message: 'El precio debe ser mayor a cero.' })
  precio!: number

  @IsInt({ message: 'La cantidad debe ser un número entero.' })
  @Min(0, { message: 'La cantidad no puede ser negativa.' })
  cantidad!: number

  @IsOptionalButNotNull()
  @IsBoolean({ message: 'La disponibilidad debe ser verdadero o falso.' })
  disponible?: boolean
}
