import { Collection, Entity, OneToMany, Opt, PrimaryKey, Property } from "@mikro-orm/core";
import { ProjectMembership } from "./project-membership.entity";

@Entity()
export class Project {
    @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
    id!: string;

    @Property()
    name!: string;

    @OneToMany(() => ProjectMembership, membership => membership.project, { hidden: true })
    memberships = new Collection<ProjectMembership>(this);

    @Property({ name: 'created_at', defaultRaw: 'now()' })
    createdAt!: Date & Opt;

    @Property({ name: 'updated_at', defaultRaw: 'now()', onUpdate: () => new Date() })
    updatedAt!: Date & Opt
}