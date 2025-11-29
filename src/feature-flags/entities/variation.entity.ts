import { Entity, ManyToOne, OneToOne, Opt, PrimaryKey, Property } from "@mikro-orm/core";
import { User } from "../../users/user.entity";
import { FeatureFlag } from "./feature-flag.entity";

@Entity({ tableName: 'variations' })
export class Variation {
    @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
    id: string;

    @ManyToOne(() => FeatureFlag, { hidden: true })
    flag!: FeatureFlag;

    @Property({ nullable: true })
    name?: string;

    @Property({ nullable: true })
    description?: string;

    @Property({ type: 'json' })
    value!: {
        type: 'string' | 'number' | 'boolean' | 'json';
        data: string | number | boolean | object;
    }

    // TODO - rule edges for quick of which rules point to this variation
    // @OneToMany(() => RuleEdge, edge => edge.variation)
    // ruleEdges = new Collection<RuleEdge>(this);

    @ManyToOne(() => User, { hidden: true })
    createdBy!: User;

    @Property({ name: 'created_at', defaultRaw: 'now()' })
    createdAt!: Date & Opt;

    @Property({ name: 'updated_at', defaultRaw: 'now()', onUpdate: () => new Date() })
    updatedAt!: Date & Opt
}