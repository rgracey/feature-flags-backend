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

    @ManyToOne(() => FeatureFlag, { hidden: true })
    parentFlag?: FeatureFlag | null;

    @ManyToOne(() => User, { hidden: true })
    createdBy!: User;

    @Property({ name: 'created_at', defaultRaw: 'now()' })
    createdAt!: Date & Opt;

    @Property({ name: 'updated_at', defaultRaw: 'now()', onUpdate: () => new Date() })
    updatedAt!: Date & Opt
}