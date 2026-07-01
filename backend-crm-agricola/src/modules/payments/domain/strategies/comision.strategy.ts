export const COMISION_STRATEGY = Symbol('COMISION_STRATEGY')

export interface ComisionStrategy {
  calcular(subtotal: number): number
}
