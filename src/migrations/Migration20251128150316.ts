import { Migration } from '@mikro-orm/migrations';

export class Migration20251128150316 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "segments" drop constraint "segments_rule_set_id_foreign";`);

    this.addSql(`alter table "feature_flag" drop constraint "feature_flag_rule_set_id_foreign";`);

    this.addSql(`drop index "rule_sets_type_index";`);
    this.addSql(`alter table "rule_sets" drop column "type", drop column "variation_id", drop column "rollout_percentage";`);

    this.addSql(`alter table "segments" drop constraint "segments_rule_set_id_unique";`);
    this.addSql(`alter table "segments" drop column "rule_set_id";`);

    this.addSql(`alter table "feature_flag" drop constraint "feature_flag_rule_set_id_unique";`);
    this.addSql(`alter table "feature_flag" drop column "rule_set_id";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "rule_sets" add column "type" varchar(255) not null, add column "variation_id" varchar(255) null, add column "rollout_percentage" real null default 0;`);
    this.addSql(`create index "rule_sets_type_index" on "rule_sets" ("type");`);

    this.addSql(`alter table "segments" add column "rule_set_id" uuid null;`);
    this.addSql(`alter table "segments" add constraint "segments_rule_set_id_foreign" foreign key ("rule_set_id") references "rule_sets" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "segments" add constraint "segments_rule_set_id_unique" unique ("rule_set_id");`);

    this.addSql(`alter table "feature_flag" add column "rule_set_id" uuid null;`);
    this.addSql(`alter table "feature_flag" add constraint "feature_flag_rule_set_id_foreign" foreign key ("rule_set_id") references "rule_sets" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "feature_flag" add constraint "feature_flag_rule_set_id_unique" unique ("rule_set_id");`);
  }

}
