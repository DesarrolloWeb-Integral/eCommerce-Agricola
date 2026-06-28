import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

import type { PasswordHasherPort } from '../../../ports/out/password-hasher.port'

@Injectable()
export class BcryptPasswordHasherAdapter implements PasswordHasherPort {
  private static readonly SALT_ROUNDS = 12

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, BcryptPasswordHasherAdapter.SALT_ROUNDS)
  }

  async compare(password: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(password, passwordHash)
  }
}
