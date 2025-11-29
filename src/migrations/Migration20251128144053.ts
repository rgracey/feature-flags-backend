import { Migration } from '@mikro-orm/migrations';

export class Migration20251128144053 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "rule_sets" add column "parent_id" varchar(255) not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "rule_sets" drop column "parent_id";`);
  }

}
