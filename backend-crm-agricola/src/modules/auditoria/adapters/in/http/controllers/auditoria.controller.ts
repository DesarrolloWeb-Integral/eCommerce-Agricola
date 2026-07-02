import { Controller, Get, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../../../../../auth/adapters/in/passport/jwt-auth.guard'
import { RolesGuard } from '../../../../../auth/adapters/in/passport/roles.guard'
import { Roles } from '../../../../../auth/adapters/in/http/decorators/roles.decorator'
import { RolUsuario } from 'src/modules/usuarios/domain/value-objects/rol-usuario.enum'
import { ConsultarLogsUseCase } from '../../../../application/use-cases/consultar-logs.use-case'

@Controller('auditoria')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolUsuario.ADMINISTRADOR)
export class AuditoriaController {
  constructor(private readonly consultarLogsUseCase: ConsultarLogsUseCase) {}

  @Get()
  async obtenerRegistros() {
    return await this.consultarLogsUseCase.execute()
  }
}
