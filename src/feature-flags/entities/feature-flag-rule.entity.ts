import { Entity, ManyToOne, Opt, PrimaryKey, Property } from "@mikro-orm/core";
import { User } from "../../users/user.entity";
import { FeatureFlag } from "./feature-flag.entity";

@Entity({ tableName: 'feature_flag_rules' })
export class FeatureFlagRule {
    @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
    id: string;

    @Property({ nullable: true })
    name?: string;

    @Property()
    order!: number;

    // The value to return if the rule matches
    @Property()
    value!: string;

    // A JSON string representing the conditions for this rule
    @Property({ type: 'jsonb', default: [] })
    conditions!: {
        attribute: string;
        operator: string;
        value: string;
    }[];

    @ManyToOne(() => FeatureFlag, { hidden: true })
    parentFlag?: FeatureFlag | null;

    @ManyToOne(() => User, { hidden: true })
    createdBy!: User;
}