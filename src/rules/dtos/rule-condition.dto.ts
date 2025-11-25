import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString } from "class-validator";

export abstract class RuleConditionDto {
    @ApiProperty({ enum: ['attribute', 'segment'] })
    @IsEnum(['attribute', 'segment'])
    type: 'attribute' | 'segment';
}

export class AttributeConditionDto extends RuleConditionDto {
    @ApiProperty({ example: 'attribute', default: 'attribute' })
    readonly type: 'attribute' = 'attribute';

    @ApiProperty({ example: "country", description: "The attribute to check" })
    @IsString()
    readonly attribute: string;

    @ApiProperty({ example: "==", description: "The operator to use for comparison" })
    @IsString()
    readonly operator: string;

    @ApiProperty({ example: ["US"], description: "The value to compare against", isArray: true })
    @IsString({ each: true })
    readonly value: string[];
}

export class SegmentConditionDto extends RuleConditionDto {
    @ApiProperty({ example: 'segment', default: 'segment' })
    readonly type: 'segment' = 'segment';

    @ApiProperty({ example: "segment-id-123", description: "The ID of the segment to check" })
    @IsString()
    readonly segmentId: string;
}