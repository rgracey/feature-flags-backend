import { Migration } from '@mikro-orm/migrations';

export class Migration20251123144623 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "feature_flag" drop constraint "feature_flag_pkey";`);
    this.addSql(`alter table "feature_flag" drop column "id";`);

    this.addSql(`alter table "feature_flag" alter column "key" type varchar(100) using ("key"::varchar(100));`);
    this.addSql(`alter table "feature_flag" add constraint "feature_flag_pkey" primary key ("key");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "feature_flag" drop constraint "feature_flag_pkey";`);

    this.addSql(`alter table "feature_flag" add column "id" uuid not null default gen_random_uuid();`);
    this.addSql(`alter table "feature_flag" alter column "key" type varchar(255) using ("key"::varchar(255));`);
    this.addSql(`alter table "feature_flag" add constraint "feature_flag_pkey" primary key ("id");`);
  }

}
