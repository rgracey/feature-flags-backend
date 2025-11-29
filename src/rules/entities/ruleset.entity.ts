import { Entity, ManyToOne, Opt, PrimaryKey, Property, Unique } from "@mikro-orm/core";
import { Rule } from "../types";

@Entity({ tableName: 'rulesets' })
export class Ruleset {
    @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
    id: string;

    @Property()
    @Unique()
    parentId!: string;

    @Property({ type: 'jsonb', default: [] })
    rules!: Rule[];

    @Property({ name: 'created_at', defaultRaw: 'now()' })
    createdAt!: Date & Opt;

    @Property({ name: 'updated_at', defaultRaw: 'now()', onUpdate: () => new Date() })
    updatedAt!: Date & Opt
}