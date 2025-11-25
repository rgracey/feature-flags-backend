import { Migration } from '@mikro-orm/migrations';

export class Migration20251125122443 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "rules" add column "rollout_percentage" real not null default 0, add column "created_at" varchar(255) not null default now(), add column "updated_by_id" uuid null, add column "updated_at" varchar(255) not null default now();`);
    this.addSql(`alter table "rules" add constraint "rules_updated_by_id_foreign" foreign key ("updated_by_id") references "user" ("id") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "rules" drop constraint "rules_updated_by_id_foreign";`);

    this.addSql(`alter table "rules" drop column "rollout_percentage", drop column "created_at", drop column "updated_by_id", drop column "updated_at";`);
  }

}
