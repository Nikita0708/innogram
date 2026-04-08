import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakePasswordHashNullable1744120000000 implements MigrationInterface {
  name = 'MakePasswordHashNullable1744120000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "auth"."accounts" ALTER COLUMN "password_hash" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE "auth"."accounts" SET "password_hash" = '' WHERE "password_hash" IS NULL`);
    await queryRunner.query(`ALTER TABLE "auth"."accounts" ALTER COLUMN "password_hash" SET NOT NULL`);
  }
}
