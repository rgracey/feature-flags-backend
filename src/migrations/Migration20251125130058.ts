import { Migration } from '@mikro-orm/migrations';

export class Migration20251125130058 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`drop table if exists "feature_flag_rules" cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table "feature_flag_rules" ("id" uuid not null default gen_random_uuid(), "name" varchar(255) null, "order" int not null, "value" varchar(255) not null, "conditions" jsonb not null default '[]', "parent_flag_id" uuid not null, "created_by_id" uuid not null, constraint "feature_flag_rules_pkey" primary key ("id"));`);

    this.addSql(`alter table "feature_flag_rules" add constraint "feature_flag_rules_parent_flag_id_foreign" foreign key ("parent_flag_id") references "feature_flag" ("id") on update cascade;`);
    this.addSql(`alter table "feature_flag_rules" add constraint "feature_flag_rules_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade;`);
  }

}
