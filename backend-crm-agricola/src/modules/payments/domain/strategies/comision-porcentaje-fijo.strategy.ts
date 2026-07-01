import type { ComisionStrategy } from './comision.strategy'

export class ComisionPorcentajeFijoStrategy implements ComisionStrategy {
  constructor(private readonly porcentaje: number) {
    if (!Number.isFinite(porcentaje) || porcentaje < 0 || porcentaje > 100) {
      throw new Error('El porcentaje de comisión debe ser un número entre 0 y 100.')
    }
  }

  calcular(subtotal: number): number {
    if (!Number.isFinite(subtotal) || subtotal < 0) {
      throw new Error('El subtotal debe ser un número mayor o igual a cero.')
    }

    return Math.round(((subtotal * this.porcentaje) / 100 + Number.EPSILON) * 100) / 100
  }
}
