import { ApiExtraModels, ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
import { AttributeConditionDto, SegmentConditionDto } from "./rule-condition.dto";

@ApiExtraModels(AttributeConditionDto, SegmentConditionDto)
class BaseRuleDto {
    @ApiProperty({ example: 'My rule 1', description: 'The name of the rule', required: false })
    @IsString()
    readonly name?: string;

    @ApiProperty({ example: 'This rule checks if the user is from the US', description: 'A brief description of the rule', required: false })
    @IsString()
    readonly description?: string;

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
}

export class FeatureFlagRuleDto extends BaseRuleDto {
    @ApiProperty({ example: 'variation_12345', description: 'The ID of the variation to serve when this rule matches' })
    @IsString()
    readonly variationId!: string;

    @ApiProperty({
        type: 'number',
        format: 'float',
        default: 0,
        description: 'The percentage of users to whom the variation is rolled out'
    })
    @IsNumber()
    readonly rolloutPercentage!: number;
}

export class SegmentRuleDto extends BaseRuleDto { }