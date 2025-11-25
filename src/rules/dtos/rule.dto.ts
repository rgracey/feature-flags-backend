import { ApiExtraModels, ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { AttributeConditionDto, RuleConditionDto, SegmentConditionDto } from "./rule-condition.dto";

@ApiExtraModels(AttributeConditionDto, SegmentConditionDto)
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

    @ApiProperty({
        description: "The conditions for this rule",
        type: 'array',
        items: {
            oneOf: [
                { $ref: getSchemaPath(AttributeConditionDto) },
                { $ref: getSchemaPath(SegmentConditionDto) },
            ]
        }
    })
    readonly conditions: (AttributeConditionDto | SegmentConditionDto)[];

    @ApiProperty({ example: 1, description: "The order of the rule" })
    readonly order?: number;

    @ApiProperty({ example: 50, description: "The rollout percentage for this rule" })
    readonly rolloutPercentage: number;
}