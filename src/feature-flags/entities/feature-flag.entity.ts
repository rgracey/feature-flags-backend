import { Entity, ManyToOne, Opt, PrimaryKey, Property } from "@mikro-orm/core";
import { Environment } from "../../environments/environment.entity";
import { Project } from "../../projects/entities/project.entity";
import { User } from "../../users/user.entity";

@Entity()
export class FeatureFlag {
    @PrimaryKey({ type: 'string', length: 100 })
    key!: string;

    @Property()
    name!: string;

    @Property({ nullable: true })
    description?: string;

    @Property({name: 'value_type'})
    valueType!: string;

    @Property({name: 'default_value'})
    defaultValue!: string;

    @ManyToOne(() => Project, { hidden: true })
    project!: Project;

    @ManyToOne(() => User, { hidden: true })
    createdBy!: User;

    @Property({ name: 'created_at', defaultRaw: 'now()' })
    createdAt!: Date & Opt;

    @Property({ name: 'updated_at', defaultRaw: 'now()', onUpdate: () => new Date() })
    updatedAt!: Date & Opt
}