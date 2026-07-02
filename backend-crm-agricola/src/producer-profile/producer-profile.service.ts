import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ILike, Repository } from 'typeorm'

import { USUARIO_REPOSITORY_PORT } from 'src/modules/usuarios/ports/out/usuario-repository.port'
import type { UsuarioRepositoryPort } from 'src/modules/usuarios/ports/out/usuario-repository.port'
import {
  CreateProducerProfileDto,
  PrivateProducerProfileDto,
  PublicProducerProfileDto,
  UpdateProducerProfileDto,
} from './dto/producer-profile.dto'
import { ProducerProfile } from './entities/producer-profile.entity'

@Injectable()
export class ProducerProfileService {
  constructor(
    @InjectRepository(ProducerProfile)
    private readonly profileRepository: Repository<ProducerProfile>,

    @Inject(USUARIO_REPOSITORY_PORT)
    private readonly usuarioRepository: UsuarioRepositoryPort
  ) {}

  async create(userId: string, dto: CreateProducerProfileDto): Promise<PrivateProducerProfileDto> {
    const existing = await this.profileRepository.findOne({ where: { userId } })

    if (existing) {
      throw new ConflictException('Ya tienes un perfil de productor registrado.')
    }

    const normalizedDto = this.normalizeCreateDto(dto)
    const profile = this.profileRepository.create({
      userId,
      ...normalizedDto,
      socialLinks: normalizedDto.socialLinks ?? {},
    })
    const saved = await this.profileRepository.save(profile)

    return this.toPrivateDto(saved)
  }

  async update(
    profileId: string,
    requestingUserId: string,
    dto: UpdateProducerProfileDto
  ): Promise<PrivateProducerProfileDto> {
    const profile = await this.findEntityOrFail(profileId)
    this.assertOwnership(profile, requestingUserId)
    Object.assign(profile, this.normalizeUpdateDto(dto))
    const saved = await this.profileRepository.save(profile)

    return this.toPrivateDto(saved)
  }

  async findOwn(requestingUserId: string): Promise<PrivateProducerProfileDto> {
    const profile = await this.profileRepository.findOne({
      where: { userId: requestingUserId },
    })

    if (!profile) {
      throw new NotFoundException('No tienes un perfil de productor todavia.')
    }

    return this.toPrivateDto(profile)
  }

  async findPublicById(profileId: string): Promise<PublicProducerProfileDto> {
    const profile = await this.findEntityOrFail(profileId)

    if (!(await this.isPubliclyAvailable(profile))) {
      return this.toUnavailablePublicDto(profile)
    }

    return this.toPublicDto(profile)
  }

  async findPublicByUserId(userId: string): Promise<PublicProducerProfileDto> {
    const profile = await this.profileRepository.findOne({ where: { userId } })

    if (!profile) {
      throw new NotFoundException('Perfil de productor no encontrado.')
    }

    if (!(await this.isPubliclyAvailable(profile))) {
      return this.toUnavailablePublicDto(profile)
    }

    return this.toPublicDto(profile)
  }

  async searchByName(query: string): Promise<PublicProducerProfileDto[]> {
    if (!query || query.trim().length < 2) return []

    const profiles = await this.profileRepository.find({
      where: {
        businessName: ILike(`%${query.trim()}%`),
        isActive: true,
      },
      order: { businessName: 'ASC' },
      take: 20,
    })
    const availableProfiles = await this.filterAvailableProfiles(profiles)

    return availableProfiles.map((profile) => this.toPublicDto(profile))
  }

  async findRecommended(limit = 6): Promise<PublicProducerProfileDto[]> {
    const profiles = await this.profileRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
      take: limit,
    })
    const availableProfiles = await this.filterAvailableProfiles(profiles)

    return availableProfiles.map((profile) => this.toPublicDto(profile))
  }

  private async findEntityOrFail(profileId: string): Promise<ProducerProfile> {
    const profile = await this.profileRepository.findOne({ where: { id: profileId } })

    if (!profile) {
      throw new NotFoundException(`Perfil con id '${profileId}' no encontrado.`)
    }

    return profile
  }

  private assertOwnership(profile: ProducerProfile, requestingUserId: string): void {
    if (profile.userId !== requestingUserId) {
      throw new ForbiddenException('No tienes permiso para modificar este perfil.')
    }
  }

  private normalizeCreateDto(dto: CreateProducerProfileDto): CreateProducerProfileDto {
    return {
      ...dto,
      businessName: dto.businessName.trim(),
      description: dto.description?.trim(),
      generalLocation: dto.generalLocation?.trim(),
      contactPhone: dto.contactPhone?.trim(),
      contactEmail: dto.contactEmail?.trim().toLowerCase(),
      socialLinks: this.normalizeSocialLinks(dto.socialLinks),
      internalNotes: dto.internalNotes?.trim(),
    }
  }

  private normalizeUpdateDto(dto: UpdateProducerProfileDto): UpdateProducerProfileDto {
    const normalizedDto: UpdateProducerProfileDto = { ...dto }

    if (dto.businessName !== undefined) normalizedDto.businessName = dto.businessName.trim()
    if (dto.description !== undefined) normalizedDto.description = dto.description.trim()
    if (dto.generalLocation !== undefined)
      normalizedDto.generalLocation = dto.generalLocation.trim()
    if (dto.contactPhone !== undefined) normalizedDto.contactPhone = dto.contactPhone.trim()
    if (dto.contactEmail !== undefined) {
      normalizedDto.contactEmail = dto.contactEmail.trim().toLowerCase()
    }
    if (dto.socialLinks !== undefined) {
      normalizedDto.socialLinks = this.normalizeSocialLinks(dto.socialLinks)
    }
    if (dto.internalNotes !== undefined) normalizedDto.internalNotes = dto.internalNotes.trim()

    return normalizedDto
  }

  private normalizeSocialLinks(
    socialLinks?: Record<string, string> | null
  ): Record<string, string> | undefined {
    if (!socialLinks) return undefined

    return Object.fromEntries(
      Object.entries(socialLinks).map(([platform, url]) => [platform, url.trim()])
    )
  }

  private async filterAvailableProfiles(profiles: ProducerProfile[]): Promise<ProducerProfile[]> {
    const availability = await Promise.all(
      profiles.map(async (profile) => ({
        profile,
        isAvailable: await this.isPubliclyAvailable(profile),
      }))
    )

    return availability.filter((item) => item.isAvailable).map((item) => item.profile)
  }

  private async isPubliclyAvailable(profile: ProducerProfile): Promise<boolean> {
    const usuario = await this.usuarioRepository.findById(profile.userId)

    return Boolean(profile.isActive && usuario?.isActive && !usuario.isCancelled())
  }

  private toPublicDto(p: ProducerProfile): PublicProducerProfileDto {
    return {
      id: p.id,
      businessName: p.businessName,
      description: p.description,
      generalLocation: p.generalLocation,
      contactPhone: null,
      contactEmail: null,
      socialLinks: {},
      isAvailable: true,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }
  }

  private toUnavailablePublicDto(p: ProducerProfile): PublicProducerProfileDto {
    return {
      id: p.id,
      businessName: 'Productor no disponible',
      description: 'Este productor no se encuentra disponible.',
      generalLocation: null,
      contactPhone: null,
      contactEmail: null,
      socialLinks: {},
      isAvailable: false,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }
  }

  private toPrivateDto(p: ProducerProfile): PrivateProducerProfileDto {
    return {
      id: p.id,
      businessName: p.businessName,
      description: p.description,
      generalLocation: p.generalLocation,
      contactPhone: p.contactPhone,
      contactEmail: p.contactEmail,
      socialLinks: p.socialLinks ?? {},
      isAvailable: p.isActive,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      userId: p.userId,
      internalNotes: p.internalNotes,
      isActive: p.isActive,
    }
  }
}
