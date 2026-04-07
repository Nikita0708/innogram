import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeletedAtToProfile1775561301413 implements MigrationInterface {
    name = 'AddDeletedAtToProfile1775561301413'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "main"."profiles" ADD "deleted_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "main"."profiles" DROP COLUMN "deleted_at"`);
    }

}
