import { IsUUID } from 'class-validator'

export class ConversacionIdParamDto {
  @IsUUID()
  id!: string
}
