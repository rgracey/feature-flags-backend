import { Migration } from '@mikro-orm/migrations';

export class Migration20251128163524 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "rulesets" ("id" uuid not null default gen_random_uuid(), "parent_id" varchar(255) not null, "rules" jsonb not null default '[]', "created_at" varchar(255) not null default now(), "updated_at" varchar(255) not null default now(), constraint "rulesets_pkey" primary key ("id"));`);
    this.addSql(`alter table "rulesets" add constraint "rulesets_parent_id_unique" unique ("parent_id");`);

    this.addSql(`drop table if exists "rule_sets" cascade;`);

    this.addSql(`alter table "segments" drop constraint "segments_project_id_key_unique";`);
    this.addSql(`alter table "segments" drop column "key";`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table "rule_sets" ("id" uuid not null default gen_random_uuid(), "parent_id" varchar(255) not null, "rules" jsonb not null default '[]', "created_at" varchar(255) not null default now(), "updated_at" varchar(255) not null default now(), constraint "rule_sets_pkey" primary key ("id"));`);
    this.addSql(`alter table "rule_sets" add constraint "rule_sets_parent_id_unique" unique ("parent_id");`);

    this.addSql(`drop table if exists "rulesets" cascade;`);

    this.addSql(`alter table "segments" add column "key" varchar(255) not null;`);
    this.addSql(`alter table "segments" add constraint "segments_project_id_key_unique" unique ("project_id", "key");`);
  }

}
