import { ComisionPorcentajeFijoStrategy } from './comision-porcentaje-fijo.strategy'

describe('ComisionPorcentajeFijoStrategy', () => {
  it('debe calcular correctamente una comisión del 10%', () => {
    const strategy = new ComisionPorcentajeFijoStrategy(10)

    const comision = strategy.calcular(100)

    expect(comision).toBe(10)
  })

  it('debe redondear la comisión a dos decimales', () => {
    const strategy = new ComisionPorcentajeFijoStrategy(10)

    const comision = strategy.calcular(123.45)

    expect(comision).toBe(12.35)
  })
})
