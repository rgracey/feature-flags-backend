import { ApiProperty } from "@nestjs/swagger";
import { IsString, Matches } from "class-validator";
import { RuleDto } from "src/rules";

export class CreateSegmentDto {
    @ApiProperty({ example: 'My Segment', description: 'The name of the segment' })
    @IsString()
    readonly name: string;

    @ApiProperty({ example: 'segment-key-1', description: 'The unique key for the segment' })
    @IsString()
    @Matches(/^[a-zA-Z0-9-_]+$/, { message: 'Key can only contain letters, numbers, hyphens, and underscores' })
    readonly key: string;

    @ApiProperty({ example: 'This segment is for beta users', description: 'The description of the segment', required: false })
    @IsString()
    readonly description?: string;

    @ApiProperty({ type: () => [RuleDto], description: 'The list of rules for the feature flag' })
    readonly rules: RuleDto[];
}