import { useState, useEffect, useMemo, useCallback } from 'react'
import type {
  PrivateProducerProfile,
  ProducerProfileFormData,
  ProfileFormErrors,
} from '../types/producer-profile.types'
import {
  createProducerProfile,
  updateProducerProfile,
  getOwnProducerProfile,
} from '../services/producer-profile.service'
import { validateProfileForm, isFormValid } from '../services/producer-profile.validators'

const INITIAL_FORM: ProducerProfileFormData = {
  businessName: '',
  description: '',
  generalLocation: '',
  contactPhone: '',
  contactEmail: '',
  socialLinks: { whatsapp: '', facebook: '', instagram: '' },
  internalNotes: '',
}

export function useProducerProfileForm() {
  const [profile, setProfile] = useState<PrivateProducerProfile | null>(null)
  const [form, setForm] = useState<ProducerProfileFormData>(INITIAL_FORM)
  const [touched, setTouched] = useState<Partial<Record<keyof ProducerProfileFormData, boolean>>>(
    {}
  )
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [apiError, setApiError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Cargar perfil existente al montar
  useEffect(() => {
    getOwnProducerProfile()
      .then((p) => {
        setProfile(p)
        setForm({
          businessName: p.businessName ?? '',
          description: p.description ?? '',
          generalLocation: p.generalLocation ?? '',
          contactPhone: p.contactPhone ?? '',
          contactEmail: p.contactEmail ?? '',
          socialLinks: p.socialLinks ?? { whatsapp: '', facebook: '', instagram: '' },
          internalNotes: p.internalNotes ?? '',
        })
      })
      .catch(() => {
        // Sin perfil todavía — modo creación
      })
      .finally(() => setIsFetching(false))
  }, [])

  // ✅ Fix 1: useMemo en lugar de useEffect para derivar errores sin setState en efecto
  const errors = useMemo<ProfileFormErrors>(() => {
    const allErrors = validateProfileForm(form)
    const relevantErrors: ProfileFormErrors = {}
    for (const key of Object.keys(allErrors) as (keyof ProfileFormErrors)[]) {
      if (touched[key]) relevantErrors[key] = allErrors[key]
    }
    return relevantErrors
  }, [form, touched])

  const handleChange = useCallback((field: keyof ProducerProfileFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleSocialLinkChange = useCallback((platform: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value },
    }))
  }, [])

  const handleBlur = useCallback((field: keyof ProducerProfileFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setApiError(null)
      setSuccessMessage(null)

      // Marcar todos los campos como tocados para mostrar errores
      const allTouched = Object.fromEntries(
        Object.keys(INITIAL_FORM).map((k) => [k, true])
      ) as Partial<Record<keyof ProducerProfileFormData, boolean>>
      setTouched(allTouched)

      const validationErrors = validateProfileForm(form)
      if (!isFormValid(validationErrors)) return

      setIsLoading(true)
      try {
        const payload: Partial<ProducerProfileFormData> = {
          businessName: form.businessName.trim(),
          description: form.description.trim() || undefined,
          generalLocation: form.generalLocation.trim() || undefined,
          contactPhone: form.contactPhone.trim() || undefined,
          contactEmail: form.contactEmail.trim() || undefined,
          socialLinks: Object.fromEntries(
            Object.entries(form.socialLinks).filter(([, v]) => !!v?.trim())
          ),
          internalNotes: form.internalNotes.trim() || undefined,
        }

        const saved = profile
          ? await updateProducerProfile(profile.id, payload)
          : await createProducerProfile(payload)

        setProfile(saved)
        setSuccessMessage(
          profile ? 'Perfil actualizado correctamente.' : 'Perfil creado correctamente.'
        )
      } catch (err: unknown) {
        // ✅ Fix 2: err tipado como unknown, cast seguro a string
        const message = err instanceof Error ? err.message : 'Ocurrió un error. Intenta de nuevo.'
        setApiError(message)
      } finally {
        setIsLoading(false)
      }
    },
    [form, profile]
  )

  return {
    profile,
    form,
    errors,
    isLoading,
    isFetching,
    apiError,
    successMessage,
    isEditing: !!profile,
    handleChange,
    handleSocialLinkChange,
    handleBlur,
    handleSubmit,
  }
}
