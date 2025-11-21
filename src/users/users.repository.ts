import { EntityRepository } from "@mikro-orm/postgresql";
import { User } from "./user.entity";

export class UsersRepository extends EntityRepository<User> {
  // your custom methods...
}