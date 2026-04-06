import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1775460711770 implements MigrationInterface {
    name = 'InitialSchema1775460711770'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "auth"`);
        await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "main"`);
        await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "notification"`);
        await queryRunner.query(`CREATE TABLE "auth"."accounts" ("id" character varying(36) NOT NULL, "user_id" character varying(36) NOT NULL, "email" character varying(255) NOT NULL, "password_hash" character varying(255) NOT NULL, "provider" character varying(20) NOT NULL DEFAULT 'local', "provider_id" character varying(255), "last_login_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying(36), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying(36), CONSTRAINT "UQ_ee66de6cdc53993296d1ceb8aa0" UNIQUE ("email"), CONSTRAINT "PK_5a7a02c20412299d198e097a8fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "main"."profiles_follows" ("id" character varying(36) NOT NULL, "follower_profile_id" character varying(36) NOT NULL, "followed_profile_id" character varying(36) NOT NULL, "accepted" boolean, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying(36) NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying(36), CONSTRAINT "UQ_32580493d46f0f04500d87560ee" UNIQUE ("follower_profile_id", "followed_profile_id"), CONSTRAINT "CHK_f37de2d7d123c6a5bddd42d863" CHECK ("follower_profile_id" != "followed_profile_id"), CONSTRAINT "PK_2afda6a64450b244f2afc2340f6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "main"."profiles" ("id" character varying(36) NOT NULL, "user_id" character varying(36) NOT NULL, "username" character varying(50) NOT NULL, "display_name" character varying(100) NOT NULL, "birthday" date NOT NULL, "bio" text, "avatar_url" character varying(500), "is_public" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying(36) NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying(36), "deleted" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_d1ea35db5be7c08520d70dc03f8" UNIQUE ("username"), CONSTRAINT "PK_8e520eb4da7dc01d0e190447c8e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "auth"."users" ("id" character varying(36) NOT NULL, "role" character varying(20) NOT NULL DEFAULT 'User', "disabled" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying(36), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying(36), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "main"."profile_configurations" ("id" character varying(36) NOT NULL, "config_key" character varying(100) NOT NULL, "is_admin_accessible_only" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying(36) NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying(36), CONSTRAINT "PK_05de79a7016d27b9fc83edba37b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "main"."profiles_to_profiles_configurations" ("id" character varying(36) NOT NULL, "profile_id" character varying(36) NOT NULL, "profile_configuration_id" character varying(36) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying(36) NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying(36), CONSTRAINT "UQ_bd021b7d0359eae4e7bc7ba57b0" UNIQUE ("profile_id", "profile_configuration_id"), CONSTRAINT "PK_380f86f0d986d12f6b8906c86fd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "main"."posts" ("id" character varying(36) NOT NULL, "profile_id" character varying(36) NOT NULL, "content" text NOT NULL, "is_archived" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying(36) NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying(36), CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "main"."posts_likes" ("id" character varying(36) NOT NULL, "post_id" character varying(36) NOT NULL, "profile_id" character varying(36) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying(36) NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying(36), CONSTRAINT "UQ_327119983a4164ea0c937df1f43" UNIQUE ("post_id", "profile_id"), CONSTRAINT "PK_2038d34048d51b766bca272ff5e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "main"."assets" ("id" character varying(36) NOT NULL, "file_name" character varying(255) NOT NULL, "file_path" character varying(500) NOT NULL, "file_type" character varying(100) NOT NULL, "file_size" integer NOT NULL, "order_index" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying(36) NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying(36), CONSTRAINT "PK_da96729a8b113377cfb6a62439c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "main"."posts_assets" ("id" character varying(36) NOT NULL, "post_id" character varying(36) NOT NULL, "asset_id" character varying(36) NOT NULL, "order_index" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying(36) NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying(36), CONSTRAINT "UQ_1188729b8baab72f24202b316ea" UNIQUE ("post_id", "asset_id"), CONSTRAINT "PK_c09218a1fdc5f87ee3dd32a8562" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notification"."notifications" ("id" character varying(36) NOT NULL, "type" character varying(20) NOT NULL, "title" character varying(255) NOT NULL, "message" text NOT NULL, "data" jsonb, "is_read" boolean NOT NULL DEFAULT false, "read_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying(36) NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying(36), CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "main"."chats" ("id" character varying(36) NOT NULL, "name" character varying(100) NOT NULL, "description" text, "type" character varying(20) NOT NULL DEFAULT 'private', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying(36) NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying(36), CONSTRAINT "PK_0117647b3c4a4e5ff198aeb6206" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "main"."messages" ("id" character varying(36) NOT NULL, "chat_id" character varying(36) NOT NULL, "profile_id" character varying(36) NOT NULL, "content" text NOT NULL, "reply_to_message_id" character varying(36), "is_edited" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying(36) NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying(36), "deleted" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "main"."messages_assets" ("id" character varying(36) NOT NULL, "message_id" character varying(36) NOT NULL, "asset_id" character varying(36) NOT NULL, "order_index" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying(36) NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying(36), CONSTRAINT "UQ_92ea43d89895e77cb318982e49b" UNIQUE ("message_id", "asset_id"), CONSTRAINT "PK_4d47a1f95626bec47fa39c0bdd9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "main"."comments" ("id" character varying(36) NOT NULL, "post_id" character varying(36) NOT NULL, "profile_id" character varying(36) NOT NULL, "parent_comment_id" character varying(36), "content" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying(36) NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying(36), CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "main"."comments_likes" ("id" character varying(36) NOT NULL, "comment_id" character varying(36) NOT NULL, "profile_id" character varying(36) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying(36) NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying(36), CONSTRAINT "UQ_9a8c3cd3bd75b88739122a8ad59" UNIQUE ("comment_id", "profile_id"), CONSTRAINT "PK_76e988dd40034228052b54157cb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "main"."chats_participants" ("id" character varying(36) NOT NULL, "profile_id" character varying(36) NOT NULL, "chat_id" character varying(36) NOT NULL, "role" character varying(20) NOT NULL DEFAULT 'member', "joined_at" TIMESTAMP NOT NULL, "left_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying(36) NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying(36), CONSTRAINT "UQ_e35913d87eff79d4430313e0b1b" UNIQUE ("profile_id", "chat_id"), CONSTRAINT "PK_bb39212ca0dee99682bd6904cdd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "auth"."accounts" ADD CONSTRAINT "FK_3000dad1da61b29953f07476324" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "main"."profiles_follows" ADD CONSTRAINT "FK_722f4fb48096271c96380c6278c" FOREIGN KEY ("follower_profile_id") REFERENCES "main"."profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "main"."profiles_follows" ADD CONSTRAINT "FK_90bd341302feb51c5eaa57aab32" FOREIGN KEY ("followed_profile_id") REFERENCES "main"."profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "main"."profiles" ADD CONSTRAINT "FK_9e432b7df0d182f8d292902d1a2" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "main"."profiles_to_profiles_configurations" ADD CONSTRAINT "FK_e0bf1c041c3421723e89185d4cd" FOREIGN KEY ("profile_id") REFERENCES "main"."profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "main"."profiles_to_profiles_configurations" ADD CONSTRAINT "FK_f275d37c953153a7b3f267e67b4" FOREIGN KEY ("profile_configuration_id") REFERENCES "main"."profile_configurations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "main"."posts" ADD CONSTRAINT "FK_9dbc2524c6f46641f5e7d107da1" FOREIGN KEY ("profile_id") REFERENCES "main"."profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "main"."posts_likes" ADD CONSTRAINT "FK_6faf9115f9ab73dd332d218e9ba" FOREIGN KEY ("post_id") REFERENCES "main"."posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "main"."posts_likes" ADD CONSTRAINT "FK_87047bfd925f32570f16d9ceec0" FOREIGN KEY ("profile_id") REFERENCES "main"."profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "main"."posts_assets" ADD CONSTRAINT "FK_af7c44cddba02664bdd375707c4" FOREIGN KEY ("post_id") REFERENCES "main"."posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "main"."posts_assets" ADD CONSTRAINT "FK_e14e8b24da991d85f9ba90465b8" FOREIGN KEY ("asset_id") REFERENCES "main"."assets"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "main"."messages" ADD CONSTRAINT "FK_7540635fef1922f0b156b9ef74f" FOREIGN KEY ("chat_id") REFERENCES "main"."chats"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "main"."messages" ADD CONSTRAINT "FK_f027d31c266699d0dae4366252b" FOREIGN KEY ("profile_id") REFERENCES "main"."profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "main"."messages" ADD CONSTRAINT "FK_7f87cbb925b1267778a7f4c5d67" FOREIGN KEY ("reply_to_message_id") REFERENCES "main"."messages"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "main"."messages_assets" ADD CONSTRAINT "FK_d8d48ea4985e94a520b2159f3af" FOREIGN KEY ("message_id") REFERENCES "main"."messages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "main"."messages_assets" ADD CONSTRAINT "FK_27f4e06be67fbe5888840b5ab39" FOREIGN KEY ("asset_id") REFERENCES "main"."assets"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "main"."comments" ADD CONSTRAINT "FK_6b5b121879fe056a71e8e0915c2" FOREIGN KEY ("profile_id") REFERENCES "main"."profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "main"."comments" ADD CONSTRAINT "FK_259bf9825d9d198608d1b46b0b5" FOREIGN KEY ("post_id") REFERENCES "main"."posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "main"."comments" ADD CONSTRAINT "FK_93ce08bdbea73c0c7ee673ec35a" FOREIGN KEY ("parent_comment_id") REFERENCES "main"."comments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "main"."comments_likes" ADD CONSTRAINT "FK_fab744c7db7ccbe1ded65166d73" FOREIGN KEY ("comment_id") REFERENCES "main"."comments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "main"."comments_likes" ADD CONSTRAINT "FK_1e3f43ccd0f517f3d248b952834" FOREIGN KEY ("profile_id") REFERENCES "main"."profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "main"."chats_participants" ADD CONSTRAINT "FK_68021766bd3dd7f7fb71c3273bc" FOREIGN KEY ("profile_id") REFERENCES "main"."profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "main"."chats_participants" ADD CONSTRAINT "FK_1511c4daef0688dfba61bbc2021" FOREIGN KEY ("chat_id") REFERENCES "main"."chats"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "main"."chats_participants" DROP CONSTRAINT "FK_1511c4daef0688dfba61bbc2021"`);
        await queryRunner.query(`ALTER TABLE "main"."chats_participants" DROP CONSTRAINT "FK_68021766bd3dd7f7fb71c3273bc"`);
        await queryRunner.query(`ALTER TABLE "main"."comments_likes" DROP CONSTRAINT "FK_1e3f43ccd0f517f3d248b952834"`);
        await queryRunner.query(`ALTER TABLE "main"."comments_likes" DROP CONSTRAINT "FK_fab744c7db7ccbe1ded65166d73"`);
        await queryRunner.query(`ALTER TABLE "main"."comments" DROP CONSTRAINT "FK_93ce08bdbea73c0c7ee673ec35a"`);
        await queryRunner.query(`ALTER TABLE "main"."comments" DROP CONSTRAINT "FK_259bf9825d9d198608d1b46b0b5"`);
        await queryRunner.query(`ALTER TABLE "main"."comments" DROP CONSTRAINT "FK_6b5b121879fe056a71e8e0915c2"`);
        await queryRunner.query(`ALTER TABLE "main"."messages_assets" DROP CONSTRAINT "FK_27f4e06be67fbe5888840b5ab39"`);
        await queryRunner.query(`ALTER TABLE "main"."messages_assets" DROP CONSTRAINT "FK_d8d48ea4985e94a520b2159f3af"`);
        await queryRunner.query(`ALTER TABLE "main"."messages" DROP CONSTRAINT "FK_7f87cbb925b1267778a7f4c5d67"`);
        await queryRunner.query(`ALTER TABLE "main"."messages" DROP CONSTRAINT "FK_f027d31c266699d0dae4366252b"`);
        await queryRunner.query(`ALTER TABLE "main"."messages" DROP CONSTRAINT "FK_7540635fef1922f0b156b9ef74f"`);
        await queryRunner.query(`ALTER TABLE "main"."posts_assets" DROP CONSTRAINT "FK_e14e8b24da991d85f9ba90465b8"`);
        await queryRunner.query(`ALTER TABLE "main"."posts_assets" DROP CONSTRAINT "FK_af7c44cddba02664bdd375707c4"`);
        await queryRunner.query(`ALTER TABLE "main"."posts_likes" DROP CONSTRAINT "FK_87047bfd925f32570f16d9ceec0"`);
        await queryRunner.query(`ALTER TABLE "main"."posts_likes" DROP CONSTRAINT "FK_6faf9115f9ab73dd332d218e9ba"`);
        await queryRunner.query(`ALTER TABLE "main"."posts" DROP CONSTRAINT "FK_9dbc2524c6f46641f5e7d107da1"`);
        await queryRunner.query(`ALTER TABLE "main"."profiles_to_profiles_configurations" DROP CONSTRAINT "FK_f275d37c953153a7b3f267e67b4"`);
        await queryRunner.query(`ALTER TABLE "main"."profiles_to_profiles_configurations" DROP CONSTRAINT "FK_e0bf1c041c3421723e89185d4cd"`);
        await queryRunner.query(`ALTER TABLE "main"."profiles" DROP CONSTRAINT "FK_9e432b7df0d182f8d292902d1a2"`);
        await queryRunner.query(`ALTER TABLE "main"."profiles_follows" DROP CONSTRAINT "FK_90bd341302feb51c5eaa57aab32"`);
        await queryRunner.query(`ALTER TABLE "main"."profiles_follows" DROP CONSTRAINT "FK_722f4fb48096271c96380c6278c"`);
        await queryRunner.query(`ALTER TABLE "auth"."accounts" DROP CONSTRAINT "FK_3000dad1da61b29953f07476324"`);
        await queryRunner.query(`DROP TABLE "main"."chats_participants"`);
        await queryRunner.query(`DROP TABLE "main"."comments_likes"`);
        await queryRunner.query(`DROP TABLE "main"."comments"`);
        await queryRunner.query(`DROP TABLE "main"."messages_assets"`);
        await queryRunner.query(`DROP TABLE "main"."messages"`);
        await queryRunner.query(`DROP TABLE "main"."chats"`);
        await queryRunner.query(`DROP TABLE "notification"."notifications"`);
        await queryRunner.query(`DROP TABLE "main"."posts_assets"`);
        await queryRunner.query(`DROP TABLE "main"."assets"`);
        await queryRunner.query(`DROP TABLE "main"."posts_likes"`);
        await queryRunner.query(`DROP TABLE "main"."posts"`);
        await queryRunner.query(`DROP TABLE "main"."profiles_to_profiles_configurations"`);
        await queryRunner.query(`DROP TABLE "main"."profile_configurations"`);
        await queryRunner.query(`DROP TABLE "auth"."users"`);
        await queryRunner.query(`DROP TABLE "main"."profiles"`);
        await queryRunner.query(`DROP TABLE "main"."profiles_follows"`);
        await queryRunner.query(`DROP TABLE "auth"."accounts"`);
    }

}
