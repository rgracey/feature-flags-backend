import { Migration } from '@mikro-orm/migrations';

export class Migration20251123123326 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "feature_flag" ("id" uuid not null default gen_random_uuid(), "name" varchar(255) not null, "description" varchar(255) not null, "key" varchar(255) not null, "value_type" varchar(255) not null, "default_value" varchar(255) not null, "project_id" uuid not null, "environment_id" uuid not null, "created_by_id" uuid not null, "created_at" varchar(255) not null default now(), "updated_at" varchar(255) not null default now(), constraint "feature_flag_pkey" primary key ("id"));`);

    this.addSql(`alter table "feature_flag" add constraint "feature_flag_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade;`);
    this.addSql(`alter table "feature_flag" add constraint "feature_flag_environment_id_foreign" foreign key ("environment_id") references "environment" ("id") on update cascade;`);
    this.addSql(`alter table "feature_flag" add constraint "feature_flag_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "feature_flag" cascade;`);
  }

}
