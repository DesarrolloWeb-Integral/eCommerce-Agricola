import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MaxLength,
  MinLength,
  Matches,
  IsObject,
} from 'class-validator'
import {
  IsOptionalButNotNull,
  IsSafeText,
  IsSocialLinks,
  IsTrimmedNotEmpty,
} from 'src/shared/validation/security.validators'

// ────────────────────────────────────────────────────────────────────────────
// DTO de creación
// ────────────────────────────────────────────────────────────────────────────
export class CreateProducerProfileDto {
  @IsString({ message: 'El nombre comercial debe ser texto.' })
  @IsNotEmpty({ message: 'El nombre comercial es obligatorio.' })
  @IsTrimmedNotEmpty({ message: 'El nombre comercial es obligatorio.' })
  @IsSafeText({ message: 'El nombre comercial no puede contener HTML o JavaScript.' })
  @MinLength(2, { message: 'El nombre comercial debe tener al menos 2 caracteres.' })
  @MaxLength(120, { message: 'El nombre comercial no puede superar los 120 caracteres.' })
  businessName!: string

  @IsOptionalButNotNull()
  @IsString({ message: 'La descripción debe ser texto.' })
  @IsSafeText({ message: 'La descripción no puede contener HTML o JavaScript.' })
  @MaxLength(1000, { message: 'La descripción no puede superar los 1 000 caracteres.' })
  description?: string

  @IsOptionalButNotNull()
  @IsString({ message: 'La ubicación debe ser texto.' })
  @IsSafeText({ message: 'La ubicación no puede contener HTML o JavaScript.' })
  @MaxLength(200, { message: 'La ubicación no puede superar los 200 caracteres.' })
  generalLocation?: string

  @IsOptionalButNotNull()
  @Matches(/^\+?[0-9\s\-().]{7,20}$/, {
    message: 'El teléfono de contacto no tiene un formato válido.',
  })
  contactPhone?: string

  @IsOptionalButNotNull()
  @IsEmail({}, { message: 'El correo de contacto no tiene un formato válido.' })
  @MaxLength(254, { message: 'El correo de contacto es demasiado largo.' })
  contactEmail?: string

  @IsOptionalButNotNull()
  @IsObject({ message: 'Los enlaces de redes sociales deben ser un objeto clave-valor.' })
  @IsSocialLinks({
    message: 'Los enlaces sociales solo aceptan whatsapp, facebook o instagram con URLs validas.',
  })
  socialLinks?: Record<string, string>

  // internalNotes es privado: aceptado en escritura pero nunca devuelto en la vista pública
  @IsOptionalButNotNull()
  @IsString({ message: 'Las notas internas deben ser texto.' })
  @IsSafeText({ message: 'Las notas internas no pueden contener HTML o JavaScript.' })
  @MaxLength(2000, { message: 'Las notas internas no pueden superar los 2 000 caracteres.' })
  internalNotes?: string
}

// ────────────────────────────────────────────────────────────────────────────
// DTO de actualización (todos los campos opcionales)
// ────────────────────────────────────────────────────────────────────────────
export class UpdateProducerProfileDto {
  @IsOptionalButNotNull()
  @IsString({ message: 'El nombre comercial debe ser texto.' })
  @IsTrimmedNotEmpty({ message: 'El nombre comercial no puede estar vacio.' })
  @IsSafeText({ message: 'El nombre comercial no puede contener HTML o JavaScript.' })
  @MinLength(2, { message: 'El nombre comercial debe tener al menos 2 caracteres.' })
  @MaxLength(120, { message: 'El nombre comercial no puede superar los 120 caracteres.' })
  businessName?: string

  @IsOptionalButNotNull()
  @IsString({ message: 'La descripción debe ser texto.' })
  @IsSafeText({ message: 'La descripción no puede contener HTML o JavaScript.' })
  @MaxLength(1000, { message: 'La descripción no puede superar los 1 000 caracteres.' })
  description?: string

  @IsOptionalButNotNull()
  @IsString({ message: 'La ubicación debe ser texto.' })
  @IsSafeText({ message: 'La ubicación no puede contener HTML o JavaScript.' })
  @MaxLength(200, { message: 'La ubicación no puede superar los 200 caracteres.' })
  generalLocation?: string

  @IsOptionalButNotNull()
  @Matches(/^\+?[0-9\s\-().]{7,20}$/, {
    message: 'El teléfono de contacto no tiene un formato válido.',
  })
  contactPhone?: string

  @IsOptionalButNotNull()
  @IsEmail({}, { message: 'El correo de contacto no tiene un formato válido.' })
  @MaxLength(254, { message: 'El correo de contacto es demasiado largo.' })
  contactEmail?: string

  @IsOptionalButNotNull()
  @IsObject({ message: 'Los enlaces de redes sociales deben ser un objeto clave-valor.' })
  @IsSocialLinks({
    message: 'Los enlaces sociales solo aceptan whatsapp, facebook o instagram con URLs validas.',
  })
  socialLinks?: Record<string, string>

  @IsOptionalButNotNull()
  @IsString({ message: 'Las notas internas deben ser texto.' })
  @IsSafeText({ message: 'Las notas internas no pueden contener HTML o JavaScript.' })
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
