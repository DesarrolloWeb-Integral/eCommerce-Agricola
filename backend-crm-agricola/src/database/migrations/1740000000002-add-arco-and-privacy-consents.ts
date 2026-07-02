import type { MigrationInterface, QueryRunner } from 'typeorm'

export class AddArcoAndPrivacyConsents1740000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'estado_cuenta_enum') THEN
          CREATE TYPE "estado_cuenta_enum" AS ENUM (
            'ACTIVA',
            'CANCELACION_PENDIENTE',
            'CANCELADA'
          );
        END IF;
      END
      $$;
    `)

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'privacy_document_type_enum') THEN
          CREATE TYPE "privacy_document_type_enum" AS ENUM (
            'PRIVACY_NOTICE'
          );
        END IF;
      END
      $$;
    `)

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'privacy_consent_action_enum') THEN
          CREATE TYPE "privacy_consent_action_enum" AS ENUM ('ACCEPTED');
        END IF;
      END
      $$;
    `)

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_solicitud_arco_enum') THEN
          CREATE TYPE "tipo_solicitud_arco_enum" AS ENUM (
            'ACCESO',
            'RECTIFICACION',
            'CANCELACION',
            'OPOSICION_TRANSFERENCIAS'
          );
        END IF;
      END
      $$;
    `)

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'estado_solicitud_arco_enum') THEN
          CREATE TYPE "estado_solicitud_arco_enum" AS ENUM (
            'RECIBIDA',
            'EN_REVISION',
            'ATENDIDA',
            'IMPROCEDENTE',
            'CUMPLIDA_AUTOMATICAMENTE',
            'PENDIENTE_POR_OBLIGACIONES'
          );
        END IF;
      END
      $$;
    `)

    await queryRunner.query(`
      ALTER TABLE "agro_usuario"
      ADD COLUMN IF NOT EXISTS "estado_cuenta" "estado_cuenta_enum" NOT NULL DEFAULT 'ACTIVA',
      ADD COLUMN IF NOT EXISTS "privacy_notice_accepted_at" TIMESTAMP WITH TIME ZONE NULL,
      ADD COLUMN IF NOT EXISTS "privacy_notice_version" VARCHAR(30) NULL,
      ADD COLUMN IF NOT EXISTS "optional_purposes_allowed" BOOLEAN NOT NULL DEFAULT false,
      ADD COLUMN IF NOT EXISTS "optional_purposes_updated_at" TIMESTAMP WITH TIME ZONE NULL,
      ADD COLUMN IF NOT EXISTS "cancellation_requested_at" TIMESTAMP WITH TIME ZONE NULL,
      ADD COLUMN IF NOT EXISTS "cancelled_at" TIMESTAMP WITH TIME ZONE NULL,
      ADD COLUMN IF NOT EXISTS "personal_data_disassociated_at" TIMESTAMP WITH TIME ZONE NULL
    `)

    await queryRunner.query(`
      ALTER TABLE "agro_usuario"
      ALTER COLUMN "phone" DROP NOT NULL
    `)

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "privacy_consent_log" (
        "id" UUID PRIMARY KEY,
        "user_id" UUID NOT NULL,
        "document_type" "privacy_document_type_enum" NOT NULL,
        "version" VARCHAR(30) NOT NULL,
        "accepted_at" TIMESTAMP WITH TIME ZONE NOT NULL,
        "action" "privacy_consent_action_enum" NOT NULL DEFAULT 'ACCEPTED',
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
      )
    `)

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_privacy_consent_log_user_id"
      ON "privacy_consent_log" ("user_id")
    `)

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "solicitudes_arco" (
        "id" UUID PRIMARY KEY,
        "user_id" UUID NOT NULL,
        "type" "tipo_solicitud_arco_enum" NOT NULL,
        "status" "estado_solicitud_arco_enum" NOT NULL DEFAULT 'RECIBIDA',
        "reason" TEXT NULL,
        "requested_data_description" TEXT NULL,
        "response" TEXT NULL,
        "requested_at" TIMESTAMP WITH TIME ZONE NOT NULL,
        "resolved_at" TIMESTAMP WITH TIME ZONE NULL,
        "resolved_by_user_id" UUID NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
      )
    `)

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_solicitudes_arco_user_id"
      ON "solicitudes_arco" ("user_id")
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS "solicitudes_arco"')
    await queryRunner.query('DROP TABLE IF EXISTS "privacy_consent_log"')

    await queryRunner.query(`
      ALTER TABLE "agro_usuario"
      DROP COLUMN IF EXISTS "personal_data_disassociated_at",
      DROP COLUMN IF EXISTS "cancelled_at",
      DROP COLUMN IF EXISTS "cancellation_requested_at",
      DROP COLUMN IF EXISTS "optional_purposes_updated_at",
      DROP COLUMN IF EXISTS "optional_purposes_allowed",
      DROP COLUMN IF EXISTS "privacy_notice_version",
      DROP COLUMN IF EXISTS "privacy_notice_accepted_at",
      DROP COLUMN IF EXISTS "estado_cuenta"
    `)

    await queryRunner.query('DROP TYPE IF EXISTS "estado_solicitud_arco_enum"')
    await queryRunner.query('DROP TYPE IF EXISTS "tipo_solicitud_arco_enum"')
    await queryRunner.query('DROP TYPE IF EXISTS "privacy_consent_action_enum"')
    await queryRunner.query('DROP TYPE IF EXISTS "privacy_document_type_enum"')
    await queryRunner.query('DROP TYPE IF EXISTS "estado_cuenta_enum"')
  }
}
