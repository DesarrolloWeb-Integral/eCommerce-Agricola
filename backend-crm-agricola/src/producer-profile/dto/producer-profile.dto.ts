import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  MaxLength,
  MinLength,
  Matches,
  IsObject,
} from 'class-validator'

// ────────────────────────────────────────────────────────────────────────────
// DTO de creación
// ────────────────────────────────────────────────────────────────────────────
export class CreateProducerProfileDto {
  @IsString({ message: 'El nombre comercial debe ser texto.' })
  @IsNotEmpty({ message: 'El nombre comercial es obligatorio.' })
  @MinLength(2, { message: 'El nombre comercial debe tener al menos 2 caracteres.' })
  @MaxLength(120, { message: 'El nombre comercial no puede superar los 120 caracteres.' })
  businessName!: string

  @IsOptional()
  @IsString({ message: 'La descripción debe ser texto.' })
  @MaxLength(1000, { message: 'La descripción no puede superar los 1 000 caracteres.' })
  description?: string

  @IsOptional()
  @IsString({ message: 'La ubicación debe ser texto.' })
  @MaxLength(200, { message: 'La ubicación no puede superar los 200 caracteres.' })
  generalLocation?: string

  @IsOptional()
  @Matches(/^\+?[0-9\s\-().]{7,20}$/, {
    message: 'El teléfono de contacto no tiene un formato válido.',
  })
  contactPhone?: string

  @IsOptional()
  @IsEmail({}, { message: 'El correo de contacto no tiene un formato válido.' })
  @MaxLength(254, { message: 'El correo de contacto es demasiado largo.' })
  contactEmail?: string

  @IsOptional()
  @IsObject({ message: 'Los enlaces de redes sociales deben ser un objeto clave-valor.' })
  socialLinks?: Record<string, string>

  // internalNotes es privado: aceptado en escritura pero nunca devuelto en la vista pública
  @IsOptional()
  @IsString({ message: 'Las notas internas deben ser texto.' })
  @MaxLength(2000, { message: 'Las notas internas no pueden superar los 2 000 caracteres.' })
  internalNotes?: string
}

// ────────────────────────────────────────────────────────────────────────────
// DTO de actualización (todos los campos opcionales)
// ────────────────────────────────────────────────────────────────────────────
export class UpdateProducerProfileDto {
  @IsOptional()
  @IsString({ message: 'El nombre comercial debe ser texto.' })
  @MinLength(2, { message: 'El nombre comercial debe tener al menos 2 caracteres.' })
  @MaxLength(120, { message: 'El nombre comercial no puede superar los 120 caracteres.' })
  businessName?: string

  @IsOptional()
  @IsString({ message: 'La descripción debe ser texto.' })
  @MaxLength(1000, { message: 'La descripción no puede superar los 1 000 caracteres.' })
  description?: string

  @IsOptional()
  @IsString({ message: 'La ubicación debe ser texto.' })
  @MaxLength(200, { message: 'La ubicación no puede superar los 200 caracteres.' })
  generalLocation?: string

  @IsOptional()
  @Matches(/^\+?[0-9\s\-().]{7,20}$/, {
    message: 'El teléfono de contacto no tiene un formato válido.',
  })
  contactPhone?: string

  @IsOptional()
  @IsEmail({}, { message: 'El correo de contacto no tiene un formato válido.' })
  @MaxLength(254, { message: 'El correo de contacto es demasiado largo.' })
  contactEmail?: string

  @IsOptional()
  @IsObject({ message: 'Los enlaces de redes sociales deben ser un objeto clave-valor.' })
  socialLinks?: Record<string, string>

  @IsOptional()
  @IsString({ message: 'Las notas internas deben ser texto.' })
  @MaxLength(2000, { message: 'Las notas internas no pueden superar los 2 000 caracteres.' })
  internalNotes?: string
}

// ────────────────────────────────────────────────────────────────────────────
// DTO de respuesta PÚBLICA (sin datos privados)
// ────────────────────────────────────────────────────────────────────────────
export class PublicProducerProfileDto {
  id!: string
  businessName!: string
  description!: string | null
  generalLocation!: string | null
  contactPhone!: string | null
  contactEmail!: string | null
  socialLinks!: Record<string, string>
  createdAt!: Date
  updatedAt!: Date
}

// ────────────────────────────────────────────────────────────────────────────
// DTO de respuesta PRIVADA (el productor ve sus propios datos)
// ────────────────────────────────────────────────────────────────────────────
export class PrivateProducerProfileDto extends PublicProducerProfileDto {
  userId!: string
  internalNotes!: string | null
  isActive!: boolean
}
