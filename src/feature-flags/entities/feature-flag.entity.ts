import { Collection, Entity, ManyToOne, OneToMany, Opt, PrimaryKey, Property, Unique } from "@mikro-orm/core";
import { Project } from "../../projects/entities/project.entity";
import { User } from "../../users/user.entity";
import { FeatureFlagRule } from "./feature-flag-rule.entity";

@Entity()
@Unique({ properties: ['project', 'key'] })
export class FeatureFlag {
    @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
    id: string;

    @Property({ unique: true })
    key!: string;

    @Property()
    name!: string;

    @Property({ nullable: true })
    description?: string;

    @Property({ name: 'value_type' })
    valueType!: string;

    @Property({ name: 'default_value' })
    defaultValue!: string;

    @OneToMany(() => FeatureFlagRule, rule => rule.parentFlag)
    rules = new Collection<FeatureFlagRule>(this);

    @ManyToOne(() => Project, { hidden: true })
    project!: Project;

    @ManyToOne(() => User, { hidden: true })
    createdBy!: User;

    @Property({ name: 'created_at', defaultRaw: 'now()' })
    createdAt!: Date & Opt;

    @Property({ name: 'updated_at', defaultRaw: 'now()', onUpdate: () => new Date() })
    updatedAt!: Date & Opt
}