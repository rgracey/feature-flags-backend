import { Migration } from '@mikro-orm/migrations';

export class Migration20251129014748 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "feature_flag" add column "type" varchar(255) not null;`);

    this.addSql(`alter table "variations" drop column "index";`);

    this.addSql(`alter table "variations" alter column "name" type varchar(255) using ("name"::varchar(255));`);
    this.addSql(`alter table "variations" alter column "name" drop not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "feature_flag" drop column "type";`);

    this.addSql(`alter table "variations" add column "index" int null;`);
    this.addSql(`alter table "variations" alter column "name" type varchar(255) using ("name"::varchar(255));`);
    this.addSql(`alter table "variations" alter column "name" set not null;`);
  }

}
