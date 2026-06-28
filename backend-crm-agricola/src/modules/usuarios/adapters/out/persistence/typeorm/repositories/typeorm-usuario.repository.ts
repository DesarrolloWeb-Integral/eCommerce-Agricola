import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Usuario } from '../../../../../domain/entities/usuario'
import { UsuarioRepositoryPort } from '../../../../../ports/out/usuario-repository.port'
import { UsuarioEntity } from '../entities/usuario.entity'
import { UsuarioMapper } from '../mappers/usuario.mapper'

@Injectable()
export class TypeormUsuarioRepository implements UsuarioRepositoryPort {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>
  ) {}

  async save(usuario: Usuario): Promise<Usuario> {
    const usuarioEntity = UsuarioMapper.toPersistence(usuario)

    const savedUsuarioEntity = await this.usuarioRepository.save(usuarioEntity)

    return UsuarioMapper.toDomain(savedUsuarioEntity)
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    const usuarioEntity = await this.usuarioRepository.findOneBy({ email })

    if (!usuarioEntity) {
      return null
    }

    return UsuarioMapper.toDomain(usuarioEntity)
  }

  async findByPhone(phone: string): Promise<Usuario | null> {
    const usuarioEntity = await this.usuarioRepository.findOneBy({ phone })

    if (!usuarioEntity) {
      return null
    }

    return UsuarioMapper.toDomain(usuarioEntity)
  }

  async findByEmailIncludingDeleted(email: string): Promise<Usuario | null> {
    const usuarioEntity = await this.usuarioRepository.findOne({
      where: { email },
      withDeleted: true,
    })

    if (!usuarioEntity) {
      return null
    }

    return UsuarioMapper.toDomain(usuarioEntity)
  }

  async findByPhoneIncludingDeleted(phone: string): Promise<Usuario | null> {
    const usuarioEntity = await this.usuarioRepository.findOne({
      where: { phone },
      withDeleted: true,
    })

    if (!usuarioEntity) {
      return null
    }

    return UsuarioMapper.toDomain(usuarioEntity)
  }

  async findById(id: string): Promise<Usuario | null> {
    const usuarioEntity = await this.usuarioRepository.findOneBy({ id })

    if (!usuarioEntity) {
      return null
    }

    return UsuarioMapper.toDomain(usuarioEntity)
  }
}
