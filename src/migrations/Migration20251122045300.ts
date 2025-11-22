import { Migration } from '@mikro-orm/migrations';

export class Migration20251122045300 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "environment" add column "created_by_id" uuid not null, add column "created_at" varchar(255) not null default now(), add column "updated_at" varchar(255) not null default now();`);
    this.addSql(`alter table "environment" add constraint "environment_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "environment" drop constraint "environment_created_by_id_foreign";`);

    this.addSql(`alter table "environment" drop column "created_by_id", drop column "created_at", drop column "updated_at";`);
  }

}
