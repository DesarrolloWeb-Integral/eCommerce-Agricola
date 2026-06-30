import {
  registerDecorator,
  type ValidationArguments,
  type ValidationOptions,
  ValidateIf,
} from 'class-validator'

const DANGEROUS_TEXT_PATTERN =
  /[<>]|javascript\s*:|vbscript\s*:|data\s*:\s*text\/html|on[a-z]+\s*=/i
const SOCIAL_LINK_KEYS = ['whatsapp', 'facebook', 'instagram'] as const
const SOCIAL_LINK_PATTERN = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w\-./?%&=]*)?$/i
const MAX_SOCIAL_LINK_LENGTH = 300

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isSafeText(value: string): boolean {
  return !DANGEROUS_TEXT_PATTERN.test(value)
}

function isAllowedSocialLink(value: string): boolean {
  const trimmedValue = value.trim()

  return (
    trimmedValue.length > 0 &&
    trimmedValue.length <= MAX_SOCIAL_LINK_LENGTH &&
    isSafeText(trimmedValue) &&
    SOCIAL_LINK_PATTERN.test(trimmedValue)
  )
}

export function IsTrimmedNotEmpty(validationOptions?: ValidationOptions): PropertyDecorator {
  return function (target: object, propertyName: string | symbol): void {
    registerDecorator({
      name: 'isTrimmedNotEmpty',
      target: target.constructor,
      propertyName: propertyName.toString(),
      options: validationOptions,
      validator: {
        validate(value: unknown): boolean {
          return typeof value === 'string' && value.trim().length > 0
        },
        defaultMessage(args: ValidationArguments): string {
          return `${args.property} no puede estar vacio.`
        },
      },
    })
  }
}

export function IsOptionalButNotNull(): PropertyDecorator {
  return ValidateIf((_object: unknown, value: unknown) => value !== undefined)
}

export function IsSafeText(validationOptions?: ValidationOptions): PropertyDecorator {
  return function (target: object, propertyName: string | symbol): void {
    registerDecorator({
      name: 'isSafeText',
      target: target.constructor,
      propertyName: propertyName.toString(),
      options: validationOptions,
      validator: {
        validate(value: unknown): boolean {
          if (value === undefined || value === null) return true

          return typeof value === 'string' && isSafeText(value)
        },
        defaultMessage(args: ValidationArguments): string {
          return `${args.property} contiene caracteres o codigo no permitido.`
        },
      },
    })
  }
}

export function IsSocialLinks(validationOptions?: ValidationOptions): PropertyDecorator {
  return function (target: object, propertyName: string | symbol): void {
    registerDecorator({
      name: 'isSocialLinks',
      target: target.constructor,
      propertyName: propertyName.toString(),
      options: validationOptions,
      validator: {
        validate(value: unknown): boolean {
          if (value === undefined || value === null) return true
          if (!isRecord(value)) return false

          return Object.entries(value).every(([key, link]) => {
            return (
              SOCIAL_LINK_KEYS.includes(key as (typeof SOCIAL_LINK_KEYS)[number]) &&
              typeof link === 'string' &&
              isAllowedSocialLink(link)
            )
          })
        },
        defaultMessage(): string {
          return 'Los enlaces sociales solo aceptan whatsapp, facebook o instagram con URLs validas.'
        },
      },
    })
  }
}
