import type { MigrationInterface, QueryRunner } from 'typeorm'

export class AddRoleToUsuarios1740000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "rol_usuario_enum" AS ENUM (
        'CLIENTE',
        'PROVEEDOR',
        'ADMINISTRADOR'
      )
    `)

    await queryRunner.query(`
      ALTER TABLE "usuarios"
      ADD COLUMN "role" "rol_usuario_enum"
      NOT NULL DEFAULT 'CLIENTE'
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "usuarios"
      DROP COLUMN "role"
    `)

    await queryRunner.query(`
      DROP TYPE "rol_usuario_enum"
    `)
  }
}
