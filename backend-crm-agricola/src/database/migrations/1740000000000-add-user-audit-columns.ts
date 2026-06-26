import type { MigrationInterface, QueryRunner } from 'typeorm'

export class AddUserAuditColumns1740000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "usuarios"
      ADD COLUMN "updated_at" TIMESTAMP NOT NULL DEFAULT now()
    `)

    await queryRunner.query(`
      ALTER TABLE "usuarios"
      ADD COLUMN "deleted_at" TIMESTAMP NULL
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "usuarios"
      DROP COLUMN "deleted_at"
    `)

    await queryRunner.query(`
      ALTER TABLE "usuarios"
      DROP COLUMN "updated_at"
    `)
  }
}
