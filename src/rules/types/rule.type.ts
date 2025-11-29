import { Condition } from "./condition.type";

export type Rule =
    | FeatureFlagRule
    | SegmentRule;

type BaseRule = {
    name?: string;
    description?: string;
    conditions: Condition[];
};

export type FeatureFlagRule = BaseRule & {
    type: 'feature_flag';
    variationId: string;
    rolloutPercentage: number;
};

export type SegmentRule = BaseRule & {
    type: 'segment';
};