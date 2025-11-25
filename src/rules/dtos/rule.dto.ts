import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { RuleConditionDto } from "./rule-condition.dto";

export class RuleDto {
    @ApiProperty({ example: 'uuid-v4-string', description: 'The unique identifier of the rule', required: false })
    @IsString()
    readonly id?: string;

    @ApiProperty({ example: 'My rule 1', description: 'The name of the rule', required: false })
    @IsString()
    readonly name?: string;

    @ApiProperty({ example: "23", description: "The value to return if the rule matches" })
    @IsString()
    readonly value: string;

    @ApiProperty({ type: () => [RuleConditionDto], description: "The conditions for this rule" })
    readonly conditions: RuleConditionDto[];

    @ApiProperty({ example: 1, description: "The order of the rule" })
    readonly order?: number;

    @ApiProperty({ example: 50, description: "The rollout percentage for this rule" })
    readonly rolloutPercentage: number;
}