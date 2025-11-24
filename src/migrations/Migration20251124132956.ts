import { Migration } from '@mikro-orm/migrations';

export class Migration20251124132956 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "feature_flag_rules" drop column "created_at", drop column "updated_at";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "feature_flag_rules" add column "created_at" varchar(255) not null default now(), add column "updated_at" varchar(255) not null default now();`);
  }

}
