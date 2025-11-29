import { Migration } from '@mikro-orm/migrations';

export class Migration20251128135807 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "rule_sets" ("id" uuid not null default gen_random_uuid(), "type" varchar(255) not null, "rules" jsonb not null default '[]', "created_at" varchar(255) not null default now(), "updated_at" varchar(255) not null default now(), "variation_id" varchar(255) null, "rollout_percentage" real null default 0, constraint "rule_sets_pkey" primary key ("id"));`);
    this.addSql(`create index "rule_sets_type_index" on "rule_sets" ("type");`);

    this.addSql(`create table "variations" ("id" uuid not null default gen_random_uuid(), "flag_id" uuid not null, "name" varchar(255) not null, "description" varchar(255) null, "value" jsonb not null, "index" int null, "created_by_id" uuid not null, "created_at" varchar(255) not null default now(), "updated_at" varchar(255) not null default now(), constraint "variations_pkey" primary key ("id"));`);

    this.addSql(`alter table "variations" add constraint "variations_flag_id_foreign" foreign key ("flag_id") references "feature_flag" ("id") on update cascade;`);
    this.addSql(`alter table "variations" add constraint "variations_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade;`);

    this.addSql(`drop table if exists "rules" cascade;`);

    this.addSql(`alter table "segments" add column "rule_set_id" uuid null;`);
    this.addSql(`alter table "segments" add constraint "segments_rule_set_id_foreign" foreign key ("rule_set_id") references "rule_sets" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "segments" add constraint "segments_rule_set_id_unique" unique ("rule_set_id");`);

    this.addSql(`alter table "feature_flag" drop column "value_type", drop column "default_value";`);

    this.addSql(`alter table "feature_flag" add column "default_variation_id" uuid null, add column "rule_set_id" uuid null;`);
    this.addSql(`alter table "feature_flag" add constraint "feature_flag_default_variation_id_foreign" foreign key ("default_variation_id") references "variations" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "feature_flag" add constraint "feature_flag_rule_set_id_foreign" foreign key ("rule_set_id") references "rule_sets" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "feature_flag" add constraint "feature_flag_rule_set_id_unique" unique ("rule_set_id");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "segments" drop constraint "segments_rule_set_id_foreign";`);

    this.addSql(`alter table "feature_flag" drop constraint "feature_flag_rule_set_id_foreign";`);

    this.addSql(`alter table "feature_flag" drop constraint "feature_flag_default_variation_id_foreign";`);

    this.addSql(`create table "rules" ("id" uuid not null default gen_random_uuid(), "name" varchar(255) null, "order" int not null, "value" varchar(255) not null, "conditions" jsonb not null default '[]', "rollout_percentage" real not null default 0, "parent_id" varchar(255) not null, "created_by_id" uuid not null, "created_at" varchar(255) not null default now(), "updated_by_id" uuid null, "updated_at" varchar(255) not null default now(), constraint "rules_pkey" primary key ("id"));`);

    this.addSql(`alter table "rules" add constraint "rules_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "rules" add constraint "rules_updated_by_id_foreign" foreign key ("updated_by_id") references "user" ("id") on update cascade on delete set null;`);

    this.addSql(`drop table if exists "rule_sets" cascade;`);

    this.addSql(`drop table if exists "variations" cascade;`);

    this.addSql(`alter table "segments" drop constraint "segments_rule_set_id_unique";`);
    this.addSql(`alter table "segments" drop column "rule_set_id";`);

    this.addSql(`alter table "feature_flag" drop constraint "feature_flag_rule_set_id_unique";`);
    this.addSql(`alter table "feature_flag" drop column "default_variation_id", drop column "rule_set_id";`);

    this.addSql(`alter table "feature_flag" add column "value_type" varchar(255) not null, add column "default_value" varchar(255) not null;`);
  }

}
