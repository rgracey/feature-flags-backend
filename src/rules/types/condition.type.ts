export type Condition =
    | {
        type: 'attribute';
        attribute: string;
        operator: string;
        value: string[];
    }
    | {
        type: 'segment';
        segmentId: string;
    }