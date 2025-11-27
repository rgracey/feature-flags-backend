import { Migration } from '@mikro-orm/migrations';

export class Migration20251127105645 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "segments" ("id" uuid not null default gen_random_uuid(), "key" varchar(255) not null, "name" varchar(255) not null, "description" varchar(255) null, "project_id" uuid not null, "created_by_id" uuid not null, "created_at" varchar(255) not null default now(), "updated_at" varchar(255) not null default now(), constraint "segments_pkey" primary key ("id"));`);
    this.addSql(`alter table "segments" add constraint "segments_project_id_key_unique" unique ("project_id", "key");`);

    this.addSql(`alter table "segments" add constraint "segments_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade;`);
    this.addSql(`alter table "segments" add constraint "segments_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "segments" cascade;`);
  }

}
