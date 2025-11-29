import { Migration } from '@mikro-orm/migrations';

export class Migration20251128144151 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "rule_sets" add constraint "rule_sets_parent_id_unique" unique ("parent_id");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "rule_sets" drop constraint "rule_sets_parent_id_unique";`);
  }

}
