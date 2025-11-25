import { ApiProperty } from "@nestjs/swagger";

export class EvaluationResultDto {
    constructor(value: any, matchedRuleId?: string) {
        this.value = value;
        this.matchedRuleId = matchedRuleId;
    }

    @ApiProperty({ example: "true", description: "The evaluated value of the feature flag" })
    readonly value: any;

    @ApiProperty({ example: "rule_123", description: "The ID of the matched rule, if any", required: false })
    readonly matchedRuleId?: string;
}