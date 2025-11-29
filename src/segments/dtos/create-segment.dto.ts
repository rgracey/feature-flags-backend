import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { IsArray, IsString } from "class-validator";
import { FeatureFlagRuleDto, SegmentRuleDto } from "src/rules";

@ApiExtraModels(FeatureFlagRuleDto, SegmentRuleDto)
export class CreateSegmentDto {
    @ApiProperty({ example: 'My Segment', description: 'The name of the segment' })
    @IsString()
    readonly name: string;

    @ApiProperty({ example: 'This segment is for beta users', description: 'The description of the segment', required: false })
    @IsString()
    readonly description?: string;

    @ApiProperty({
        description: 'The rules that define this segment',
        type: [SegmentRuleDto]
    })
    @IsArray()
    readonly rules: SegmentRuleDto[];
}