import { Migration } from '@mikro-orm/migrations';

export class Migration20251121150518 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "user" ("id" uuid not null default gen_random_uuid(), "email" varchar(255) not null, constraint "user_pkey" primary key ("id"));`);
  }

}
