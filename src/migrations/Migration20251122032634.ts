import { Migration } from '@mikro-orm/migrations';

export class Migration20251122032634 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "environment" ("id" uuid not null default gen_random_uuid(), "name" varchar(255) not null, "project_id" uuid not null, constraint "environment_pkey" primary key ("id"));`);

    this.addSql(`alter table "environment" add constraint "environment_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "environment" cascade;`);
  }

}
