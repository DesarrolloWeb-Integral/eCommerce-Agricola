import { Inject, Injectable } from '@nestjs/common'
import { AUDITORIA_REPOSITORY_PORT } from '../../adapters/out/auditoria.repository.port'
import type {
  AuditoriaRepositoryPort,
  LogRegistroInput,
} from '../../adapters/out/auditoria.repository.port'

@Injectable()
export class RegistrarLogUseCase {
  constructor(
    @Inject(AUDITORIA_REPOSITORY_PORT)
    private readonly auditoriaRepository: AuditoriaRepositoryPort
  ) {}

  async execute(input: LogRegistroInput): Promise<void> {
    const logLimpio = {
      ...input,
      detalle: input.detalle ? this.enmascararDatosSensibles(input.detalle) : undefined,
    }

    await this.auditoriaRepository.registrar(logLimpio)
  }

  // Regla estricta: Los logs no incluyen contraseñas, tokens, correos completos
  private enmascararDatosSensibles(texto: string): string {
    return (
      texto
        // Enmascara correos: j***@gmail.com
        .replace(
          /(^|[\s:=])([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})($|[\s;,])/g,
          (match: string, prefix: string, user: string, domain: string, suffix: string): string => {
            const maskedUser = user.length > 0 ? user.charAt(0) + '***' : '***'
            return `${prefix}${maskedUser}@${domain}${suffix}`
          }
        )
        // Elimina tokens JWT o Bearer
        .replace(
          /(Bearer\s)[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*/g,
          '$1[TOKEN_REMOVIDO]'
        )
    )
  }
}
