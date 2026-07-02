import { Usuario } from 'src/modules/usuarios/domain/entities/usuario'
import { EstadoCuenta } from 'src/modules/usuarios/domain/value-objects/estado-cuenta.enum'
import { RolUsuario } from 'src/modules/usuarios/domain/value-objects/rol-usuario.enum'
import type { UsuarioRepositoryPort } from 'src/modules/usuarios/ports/out/usuario-repository.port'
import type { CancelacionCuentaService } from '../services/cancelacion-cuenta.service'
import { ProcesarCancelacionesPendientesJob } from './procesar-cancelaciones-pendientes.job'

describe('ProcesarCancelacionesPendientesJob', () => {
  const findByEstadoCuenta = jest.fn<Promise<Usuario[]>, [EstadoCuenta]>()
  const countActiveObligations = jest.fn<Promise<number>, [string]>()
  const completeCancellation = jest.fn<Promise<unknown>, [Usuario]>()

  const usuarioRepository = {
    findByEstadoCuenta,
  } as unknown as UsuarioRepositoryPort

  const cancelacionCuentaService = {
    countActiveObligations,
    completeCancellation,
  } as unknown as CancelacionCuentaService

  const job = new ProcesarCancelacionesPendientesJob(usuarioRepository, cancelacionCuentaService)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('debe completar la cancelacion cuando la cuenta ya no tiene obligaciones activas', async () => {
    const usuario = createPendingUser()
    findByEstadoCuenta.mockResolvedValue([usuario])
    countActiveObligations.mockResolvedValue(0)
    completeCancellation.mockResolvedValue({ usuario })

    await job.runOnce()

    expect(findByEstadoCuenta).toHaveBeenCalledWith(EstadoCuenta.CANCELACION_PENDIENTE)
    expect(countActiveObligations).toHaveBeenCalledWith(usuario.id)
    expect(completeCancellation).toHaveBeenCalledWith(usuario)
  })

  it('no debe completar la cancelacion si todavia existen obligaciones activas', async () => {
    const usuario = createPendingUser()
    findByEstadoCuenta.mockResolvedValue([usuario])
    countActiveObligations.mockResolvedValue(2)

    await job.runOnce()

    expect(findByEstadoCuenta).toHaveBeenCalledWith(EstadoCuenta.CANCELACION_PENDIENTE)
    expect(countActiveObligations).toHaveBeenCalledWith(usuario.id)
    expect(completeCancellation).not.toHaveBeenCalled()
  })
})

function createPendingUser(): Usuario {
  const now = new Date('2026-07-02T12:00:00.000Z')

  return new Usuario(
    'user-id',
    'Ana',
    'Prueba',
    'ana@example.com',
    '4771234567',
    'hashed-password',
    'refresh-token-hash',
    RolUsuario.CLIENTE,
    true,
    EstadoCuenta.CANCELACION_PENDIENTE,
    now,
    '1.0',
    false,
    null,
    now,
    null,
    null,
    now,
    now,
    null
  )
}
