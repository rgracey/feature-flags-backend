import { Migration } from '@mikro-orm/migrations';

export class Migration20251123144301 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "feature_flag" drop constraint "feature_flag_environment_id_foreign";`);

    this.addSql(`alter table "feature_flag" drop column "environment_id";`);

    this.addSql(`alter table "feature_flag" alter column "description" type varchar(255) using ("description"::varchar(255));`);
    this.addSql(`alter table "feature_flag" alter column "description" drop not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "feature_flag" add column "environment_id" uuid not null;`);
    this.addSql(`alter table "feature_flag" alter column "description" type varchar(255) using ("description"::varchar(255));`);
    this.addSql(`alter table "feature_flag" alter column "description" set not null;`);
    this.addSql(`alter table "feature_flag" add constraint "feature_flag_environment_id_foreign" foreign key ("environment_id") references "environment" ("id") on update cascade;`);
  }

}
