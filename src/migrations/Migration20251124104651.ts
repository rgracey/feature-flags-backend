import { Migration } from '@mikro-orm/migrations';

export class Migration20251124104651 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "feature_flag_rules" alter column "id" drop default;`);
    this.addSql(`alter table "feature_flag_rules" alter column "id" type uuid using ("id"::text::uuid);`);
    this.addSql(`alter table "feature_flag_rules" alter column "id" set default gen_random_uuid();`);
    this.addSql(`alter table "feature_flag_rules" alter column "name" type varchar(255) using ("name"::varchar(255));`);
    this.addSql(`alter table "feature_flag_rules" alter column "name" drop not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "feature_flag_rules" alter column "id" drop default;`);
    this.addSql(`alter table "feature_flag_rules" alter column "id" drop default;`);
    this.addSql(`alter table "feature_flag_rules" alter column "id" type uuid using ("id"::text::uuid);`);
    this.addSql(`alter table "feature_flag_rules" alter column "name" type varchar(255) using ("name"::varchar(255));`);
    this.addSql(`alter table "feature_flag_rules" alter column "name" set not null;`);
  }

}
