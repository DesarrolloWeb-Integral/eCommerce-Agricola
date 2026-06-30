const DANGEROUS_TEXT_PATTERN =
  /[<>]|javascript\s*:|vbscript\s*:|data\s*:\s*text\/html|on[a-z]+\s*=/i;

export function containsUnsafeText(value: string): boolean {
  return DANGEROUS_TEXT_PATTERN.test(value);
}

export function validateSafeText(value: string, fieldLabel: string): true | string {
  return containsUnsafeText(value) ? `${fieldLabel} no puede contener HTML o JavaScript.` : true;
}

export function validateTrimmedRequired(value: string, message: string): true | string {
  return value.trim().length > 0 ? true : message;
}
