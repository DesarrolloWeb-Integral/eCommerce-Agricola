import type { ProducerProfileFormData, ProfileFormErrors } from '../types/producer-profile.types'

const PHONE_REGEX = /^\+?[0-9\s\-().]{7,20}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const URL_REGEX = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w\-./?%&=]*)?$/

/**
 * Valida el formulario completo del perfil.
 * Devuelve un objeto con los mensajes de error por campo (vacío = sin errores).
 */
export function validateProfileForm(data: ProducerProfileFormData): ProfileFormErrors {
  const errors: ProfileFormErrors = {}

  // ── businessName ──────────────────────────────────────────────────────────
  if (!data.businessName.trim()) {
    errors.businessName = 'El nombre comercial es obligatorio.'
  } else if (data.businessName.trim().length < 2) {
    errors.businessName = 'Debe tener al menos 2 caracteres.'
  } else if (data.businessName.trim().length > 120) {
    errors.businessName = 'No puede superar los 120 caracteres.'
  }

  // ── description ───────────────────────────────────────────────────────────
  if (data.description && data.description.length > 1000) {
    errors.description = 'No puede superar los 1 000 caracteres.'
  }

  // ── generalLocation ───────────────────────────────────────────────────────
  if (data.generalLocation && data.generalLocation.length > 200) {
    errors.generalLocation = 'No puede superar los 200 caracteres.'
  }

  // ── contactPhone ──────────────────────────────────────────────────────────
  if (data.contactPhone && !PHONE_REGEX.test(data.contactPhone)) {
    errors.contactPhone = 'Formato de teléfono inválido (ej. +52 477 123 4567).'
  }

  // ── contactEmail ──────────────────────────────────────────────────────────
  if (data.contactEmail && !EMAIL_REGEX.test(data.contactEmail)) {
    errors.contactEmail = 'Ingresa un correo electrónico válido.'
  }

  // ── socialLinks ───────────────────────────────────────────────────────────
  for (const [platform, url] of Object.entries(data.socialLinks)) {
    if (url && !URL_REGEX.test(url)) {
      // Reusamos la clave socialLinks con el primer error encontrado
      errors.socialLinks = `El enlace de ${platform} no parece una URL válida.`
      break
    }
  }

  // ── internalNotes ─────────────────────────────────────────────────────────
  if (data.internalNotes && data.internalNotes.length > 2000) {
    errors.internalNotes = 'No puede superar los 2 000 caracteres.'
  }

  return errors
}

/** Retorna true si el objeto de errores no tiene ninguna clave */
export function isFormValid(errors: ProfileFormErrors): boolean {
  return Object.keys(errors).length === 0
}
