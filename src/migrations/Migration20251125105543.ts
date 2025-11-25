import { Migration } from '@mikro-orm/migrations';

export class Migration20251125105543 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "rules" ("id" uuid not null default gen_random_uuid(), "name" varchar(255) null, "order" int not null, "value" varchar(255) not null, "conditions" jsonb not null default '[]', "parent_id" varchar(255) not null, "created_by_id" uuid not null, constraint "rules_pkey" primary key ("id"));`);

    this.addSql(`alter table "rules" add constraint "rules_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "rules" cascade;`);
  }

}
