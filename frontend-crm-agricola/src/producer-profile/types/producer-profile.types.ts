// ─── Tipos compartidos para el módulo de perfil de productor ───────────────

export interface SocialLinks {
  whatsapp?: string
  facebook?: string
  instagram?: string
  [key: string]: string | undefined
}

/** Datos públicos visibles para cualquier usuario */
export interface PublicProducerProfile {
  id: string
  businessName: string
  description: string | null
  generalLocation: string | null
  contactPhone: string | null
  contactEmail: string | null
  socialLinks: SocialLinks
  createdAt: string
  updatedAt: string
}

/** Datos privados: solo el productor propietario los recibe */
export interface PrivateProducerProfile extends PublicProducerProfile {
  userId: string
  internalNotes: string | null
  isActive: boolean
}

/** Payload para crear / actualizar */
export interface ProducerProfileFormData {
  businessName: string
  description: string
  generalLocation: string
  contactPhone: string
  contactEmail: string
  socialLinks: SocialLinks
  internalNotes: string
}

/** Errores de validación por campo */
export type ProfileFormErrors = Partial<Record<keyof ProducerProfileFormData, string>>
