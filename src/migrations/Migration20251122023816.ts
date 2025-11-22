import { Migration } from '@mikro-orm/migrations';

export class Migration20251122023816 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "project" ("id" uuid not null default gen_random_uuid(), "name" varchar(255) not null, "created_at" varchar(255) not null default now(), "updated_at" varchar(255) not null default now(), constraint "project_pkey" primary key ("id"));`);

    this.addSql(`create table "project_membership" ("id" uuid not null default gen_random_uuid(), "project_id" uuid not null, "user_id" uuid not null, "created_at" varchar(255) not null default now(), "updated_at" varchar(255) not null default now(), constraint "project_membership_pkey" primary key ("id"));`);

    this.addSql(`alter table "project_membership" add constraint "project_membership_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade;`);
    this.addSql(`alter table "project_membership" add constraint "project_membership_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "project_membership" drop constraint "project_membership_project_id_foreign";`);

    this.addSql(`drop table if exists "project" cascade;`);

    this.addSql(`drop table if exists "project_membership" cascade;`);
  }

}
