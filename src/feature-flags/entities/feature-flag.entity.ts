import { Collection, Entity, ManyToOne, OneToMany, OneToOne, Opt, PrimaryKey, Property, Unique } from "@mikro-orm/core";
import { Project } from "../../projects/entities/project.entity";
import { User } from "../../users/user.entity";
import { Variation } from "./variation.entity";

@Entity()
@Unique({ properties: ['project', 'key'] })
export class FeatureFlag {
    // TODO - remove and 
    @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
    id: string;

    @Property({ unique: true })
    key!: string;

    @Property()
    name!: string;

    @Property({ nullable: true })
    description?: string;

    @Property()
    type!: 'boolean' | 'string' | 'number' | 'json';

    @ManyToOne(() => Variation, { nullable: true })
    defaultVariation?: Variation;

    @OneToMany(() => Variation, v => v.flag)
    variations = new Collection<Variation>(this);

    @ManyToOne(() => Project, { hidden: true })
    project!: Project;

    @ManyToOne(() => User, { hidden: true })
    createdBy!: User;

    @Property({ name: 'created_at', defaultRaw: 'now()' })
    createdAt!: Date & Opt;

    @Property({ name: 'updated_at', defaultRaw: 'now()', onUpdate: () => new Date() })
    updatedAt!: Date & Opt
}