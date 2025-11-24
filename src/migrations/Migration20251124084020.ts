import { Migration } from '@mikro-orm/migrations';

export class Migration20251124084020 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "feature_flag_rules" ("id" uuid not null, "name" varchar(255) not null, "order" int not null, "parent_flag_key" varchar(100) not null, "created_by_id" uuid not null, "created_at" varchar(255) not null default now(), "updated_at" varchar(255) not null default now(), constraint "feature_flag_rules_pkey" primary key ("id"));`);

    this.addSql(`alter table "feature_flag_rules" add constraint "feature_flag_rules_parent_flag_key_foreign" foreign key ("parent_flag_key") references "feature_flag" ("key") on update cascade;`);
    this.addSql(`alter table "feature_flag_rules" add constraint "feature_flag_rules_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "feature_flag_rules" cascade;`);
  }

}
