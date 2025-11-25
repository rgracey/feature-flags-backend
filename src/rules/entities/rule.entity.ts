import { Entity, ManyToOne, Opt, PrimaryKey, Property } from "@mikro-orm/core";
import { User } from "../../users/user.entity";

@Entity({ tableName: 'rules' })
export class Rule {
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
        value: string[];
    }[];

    @Property({ type: 'float', default: 0 })
    rolloutPercentage!: number;

    @Property()
    parentId!: string;

    @ManyToOne(() => User, { hidden: true })
    createdBy!: User;

    @Property({ name: 'created_at', defaultRaw: 'now()' })
    createdAt!: Date & Opt;

    @ManyToOne(() => User, { hidden: true, nullable: true })
    updatedBy?: User;

    @Property({ name: 'updated_at', defaultRaw: 'now()', onUpdate: () => new Date() })
    updatedAt!: Date & Opt
}