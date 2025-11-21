import { Entity, EntityRepositoryType, PrimaryKey, Property } from "@mikro-orm/core";
import { UsersRepository } from "./users.repository";

@Entity({ repository: () => UsersRepository })
export class User {
    // to allow inference in `em.getRepository()`
    [EntityRepositoryType]?: UsersRepository;

    @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
    id!: string;

    @Property()
    email!: string;
}