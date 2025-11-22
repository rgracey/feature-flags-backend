import { Entity, ManyToOne, Opt, PrimaryKey, Property } from "@mikro-orm/core";
import { Project } from "../projects/entities/project.entity";
import { User } from "../users/user.entity";

@Entity()
export class Environment {
    @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
    id!: string;

    @Property()
    name!: string;

    @ManyToOne(() => Project, { hidden: true })
    project!: Project

    @ManyToOne(() => User, { hidden: true })
    createdBy!: User

    @Property({ name: 'created_at', defaultRaw: 'now()' })
    createdAt!: Date & Opt;

    @Property({ name: 'updated_at', defaultRaw: 'now()', onUpdate: () => new Date() })
    updatedAt!: Date & Opt
}