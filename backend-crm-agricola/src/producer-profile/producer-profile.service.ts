import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ILike, Repository } from 'typeorm'
import { ProducerProfile } from './entities/producer-profile.entity'
import {
  CreateProducerProfileDto,
  UpdateProducerProfileDto,
  PublicProducerProfileDto,
  PrivateProducerProfileDto,
} from './dto/producer-profile.dto'

@Injectable()
export class ProducerProfileService {
  constructor(
    @InjectRepository(ProducerProfile)
    private readonly profileRepository: Repository<ProducerProfile>
  ) {}

  // ─── Crear perfil ────────────────────────────────────────────────────────

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

  // ─── Actualizar perfil ───────────────────────────────────────────────────

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

  // ─── Ver perfil propio ───────────────────────────────────────────────────

  async findOwn(requestingUserId: string): Promise<PrivateProducerProfileDto> {
    const profile = await this.profileRepository.findOne({
      where: { userId: requestingUserId },
    })
    if (!profile) {
      throw new NotFoundException('No tienes un perfil de productor todavía.')
    }
    return this.toPrivateDto(profile)
  }

  // ─── Ver perfil público por ID ───────────────────────────────────────────

  async findPublicById(profileId: string): Promise<PublicProducerProfileDto> {
    const profile = await this.findEntityOrFail(profileId)
    if (!profile.isActive) {
      throw new NotFoundException('Este perfil no está disponible.')
    }
    return this.toPublicDto(profile)
  }

  // ─── Ver perfil público por userId ──────────────────────────────────────

  async findPublicByUserId(userId: string): Promise<PublicProducerProfileDto> {
    const profile = await this.profileRepository.findOne({ where: { userId } })
    if (!profile || !profile.isActive) {
      throw new NotFoundException('Perfil de productor no encontrado.')
    }
    return this.toPublicDto(profile)
  }

  // ─── NUEVO: Buscar por nombre comercial ─────────────────────────────────

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

    return profiles.map((p) => this.toPublicDto(p))
  }

  // ─── NUEVO: Listar recomendados (más recientes activos) ─────────────────

  async findRecommended(limit = 6): Promise<PublicProducerProfileDto[]> {
    const profiles = await this.profileRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
      take: limit,
    })
    return profiles.map((p) => this.toPublicDto(p))
  }

  // ─── Helpers internos ────────────────────────────────────────────────────

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
    if (dto.contactEmail !== undefined)
      normalizedDto.contactEmail = dto.contactEmail.trim().toLowerCase()
    if (dto.socialLinks !== undefined)
      normalizedDto.socialLinks = this.normalizeSocialLinks(dto.socialLinks)
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

  private toPublicDto(p: ProducerProfile): PublicProducerProfileDto {
    return {
      id: p.id,
      businessName: p.businessName,
      description: p.description,
      generalLocation: p.generalLocation,
      contactPhone: p.contactPhone,
      contactEmail: p.contactEmail,
      socialLinks: p.socialLinks ?? {},
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }
  }

  private toPrivateDto(p: ProducerProfile): PrivateProducerProfileDto {
    return {
      ...this.toPublicDto(p),
      userId: p.userId,
      internalNotes: p.internalNotes,
      isActive: p.isActive,
    }
  }
}
