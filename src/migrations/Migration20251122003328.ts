import { Migration } from '@mikro-orm/migrations';

export class Migration20251122003328 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "user" add column "password_hash" varchar(255) not null;`);
    this.addSql(`alter table "user" add constraint "user_email_unique" unique ("email");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user" drop constraint "user_email_unique";`);
    this.addSql(`alter table "user" drop column "password_hash";`);
  }

}
