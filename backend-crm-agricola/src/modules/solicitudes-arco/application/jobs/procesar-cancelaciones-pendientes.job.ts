import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common'

import { EstadoCuenta } from 'src/modules/usuarios/domain/value-objects/estado-cuenta.enum'
import {
  USUARIO_REPOSITORY_PORT,
  type UsuarioRepositoryPort,
} from 'src/modules/usuarios/ports/out/usuario-repository.port'
import { CancelacionCuentaService } from '../services/cancelacion-cuenta.service'

@Injectable()
export class ProcesarCancelacionesPendientesJob implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ProcesarCancelacionesPendientesJob.name)
  private timer: NodeJS.Timeout | null = null
  private isRunning = false

  constructor(
    @Inject(USUARIO_REPOSITORY_PORT)
    private readonly usuarioRepository: UsuarioRepositoryPort,

    private readonly cancelacionCuentaService: CancelacionCuentaService
  ) {}

  onModuleInit(): void {
    if (!this.isEnabled()) {
      this.logger.log('Job de cancelaciones pendientes desactivado.')
      return
    }

    const intervalMs = this.getIntervalMs()

    this.timer = setInterval(() => {
      void this.runOnce()
    }, intervalMs)

    this.logger.log(`Job de cancelaciones pendientes activo cada ${intervalMs} ms.`)
    void this.runOnce()
  }

  onModuleDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  async runOnce(): Promise<void> {
    if (this.isRunning) {
      return
    }

    this.isRunning = true

    try {
      const usuarios = await this.usuarioRepository.findByEstadoCuenta(
        EstadoCuenta.CANCELACION_PENDIENTE
      )
      let completed = 0

      for (const usuario of usuarios) {
        const obligations = await this.cancelacionCuentaService.countActiveObligations(usuario.id)

        if (obligations > 0) {
          this.logger.debug(
            `Cuenta ${usuario.id} mantiene ${obligations} obligacion(es) activa(s).`
          )
          continue
        }

        await this.cancelacionCuentaService.completeCancellation(usuario)
        completed += 1
        this.logger.log(`Cuenta ${usuario.id} cancelada y anonimizada automaticamente.`)
      }

      if (usuarios.length > 0) {
        this.logger.log(
          `Revision de cancelaciones pendientes: ${completed}/${usuarios.length} completada(s).`
        )
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error desconocido.'
      const stack = error instanceof Error ? error.stack : undefined

      this.logger.error(`No se pudieron procesar cancelaciones pendientes: ${message}`, stack)
    } finally {
      this.isRunning = false
    }
  }

  private isEnabled(): boolean {
    if (process.env.NODE_ENV === 'test') {
      return false
    }

    return process.env.ACCOUNT_CANCELLATION_JOB_ENABLED?.trim().toLowerCase() !== 'false'
  }

  private getIntervalMs(): number {
    const defaultIntervalMs = 60_000
    const configuredInterval = Number(process.env.ACCOUNT_CANCELLATION_JOB_INTERVAL_MS)

    if (!Number.isFinite(configuredInterval) || configuredInterval < 5_000) {
      return defaultIntervalMs
    }

    return configuredInterval
  }
}
