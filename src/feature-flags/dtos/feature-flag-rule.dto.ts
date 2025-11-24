import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { FeatureFlagRuleConditionDto } from "./update-feature-flag-rule-condition.dto";

export class FeatureFlagRuleDto {
    @ApiProperty({ example: 'My rule 1', description: 'The name of the rule', required: false })
    @IsString()
    readonly name?: string;

    @ApiProperty({ example: "23", description: "The value to return if the rule matches" })
    @IsString()
    readonly value: string;

    @ApiProperty({ type: () => [FeatureFlagRuleConditionDto], description: "The conditions for this rule" })
    readonly conditions: FeatureFlagRuleConditionDto[];
}