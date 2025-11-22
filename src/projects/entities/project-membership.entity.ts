import { Entity, ManyToOne, Opt, PrimaryKey, Property } from "@mikro-orm/core";
import { Project } from "./project.entity";
import { User } from "../../users/user.entity";

@Entity()
export class ProjectMembership {
    @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
    id!: string;

    @ManyToOne(() => Project)
    project!: Project;

    @ManyToOne(() => User)
    user!: User;

    @Property({ name: 'created_at', defaultRaw: 'now()' })
    createdAt!: Date & Opt;

    @Property({ name: 'updated_at', defaultRaw: 'now()', onUpdate: () => new Date() })
    updatedAt!: Date & Opt
}