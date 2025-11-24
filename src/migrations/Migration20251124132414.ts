import { Migration } from '@mikro-orm/migrations';

export class Migration20251124132414 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "project" ("id" uuid not null default gen_random_uuid(), "name" varchar(255) not null, "created_at" varchar(255) not null default now(), "updated_at" varchar(255) not null default now(), constraint "project_pkey" primary key ("id"));`);

    this.addSql(`create table "user" ("id" uuid not null default gen_random_uuid(), "email" varchar(255) not null, "password_hash" varchar(255) not null, constraint "user_pkey" primary key ("id"));`);
    this.addSql(`alter table "user" add constraint "user_email_unique" unique ("email");`);

    this.addSql(`create table "project_membership" ("id" uuid not null default gen_random_uuid(), "project_id" uuid not null, "user_id" uuid not null, "created_at" varchar(255) not null default now(), "updated_at" varchar(255) not null default now(), constraint "project_membership_pkey" primary key ("id"));`);

    this.addSql(`create table "feature_flag" ("id" uuid not null default gen_random_uuid(), "key" varchar(255) not null, "name" varchar(255) not null, "description" varchar(255) null, "value_type" varchar(255) not null, "default_value" varchar(255) not null, "project_id" uuid not null, "created_by_id" uuid not null, "created_at" varchar(255) not null default now(), "updated_at" varchar(255) not null default now(), constraint "feature_flag_pkey" primary key ("id"));`);
    this.addSql(`alter table "feature_flag" add constraint "feature_flag_key_unique" unique ("key");`);
    this.addSql(`alter table "feature_flag" add constraint "feature_flag_project_id_key_unique" unique ("project_id", "key");`);

    this.addSql(`create table "feature_flag_rules" ("id" uuid not null default gen_random_uuid(), "name" varchar(255) null, "order" int not null, "value" varchar(255) not null, "conditions" jsonb not null default '[]', "parent_flag_id" uuid not null, "created_by_id" uuid not null, "created_at" varchar(255) not null default now(), "updated_at" varchar(255) not null default now(), constraint "feature_flag_rules_pkey" primary key ("id"));`);

    this.addSql(`create table "environment" ("id" uuid not null default gen_random_uuid(), "name" varchar(255) not null, "project_id" uuid not null, "created_by_id" uuid not null, "created_at" varchar(255) not null default now(), "updated_at" varchar(255) not null default now(), constraint "environment_pkey" primary key ("id"));`);

    this.addSql(`alter table "project_membership" add constraint "project_membership_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade;`);
    this.addSql(`alter table "project_membership" add constraint "project_membership_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "feature_flag" add constraint "feature_flag_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade;`);
    this.addSql(`alter table "feature_flag" add constraint "feature_flag_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "feature_flag_rules" add constraint "feature_flag_rules_parent_flag_id_foreign" foreign key ("parent_flag_id") references "feature_flag" ("id") on update cascade;`);
    this.addSql(`alter table "feature_flag_rules" add constraint "feature_flag_rules_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "environment" add constraint "environment_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade;`);
    this.addSql(`alter table "environment" add constraint "environment_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "project_membership" drop constraint "project_membership_project_id_foreign";`);

    this.addSql(`alter table "feature_flag" drop constraint "feature_flag_project_id_foreign";`);

    this.addSql(`alter table "environment" drop constraint "environment_project_id_foreign";`);

    this.addSql(`alter table "project_membership" drop constraint "project_membership_user_id_foreign";`);

    this.addSql(`alter table "feature_flag" drop constraint "feature_flag_created_by_id_foreign";`);

    this.addSql(`alter table "feature_flag_rules" drop constraint "feature_flag_rules_created_by_id_foreign";`);

    this.addSql(`alter table "environment" drop constraint "environment_created_by_id_foreign";`);

    this.addSql(`alter table "feature_flag_rules" drop constraint "feature_flag_rules_parent_flag_id_foreign";`);

    this.addSql(`drop table if exists "project" cascade;`);

    this.addSql(`drop table if exists "user" cascade;`);

    this.addSql(`drop table if exists "project_membership" cascade;`);

    this.addSql(`drop table if exists "feature_flag" cascade;`);

    this.addSql(`drop table if exists "feature_flag_rules" cascade;`);

    this.addSql(`drop table if exists "environment" cascade;`);
  }

}
