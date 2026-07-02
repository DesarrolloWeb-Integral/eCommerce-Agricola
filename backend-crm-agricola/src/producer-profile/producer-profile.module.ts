import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProducerProfile } from './entities/producer-profile.entity'
import { ProducerProfileService } from './producer-profile.service'
import { ProducerProfileController } from './producer-profile.controller'
import { UsuariosModule } from 'src/modules/usuarios/usuarios.module'

@Module({
  imports: [TypeOrmModule.forFeature([ProducerProfile]), UsuariosModule],
  controllers: [ProducerProfileController],
  providers: [ProducerProfileService],
  exports: [ProducerProfileService], // por si otros módulos lo necesitan
})
export class ProducerProfileModule {}
