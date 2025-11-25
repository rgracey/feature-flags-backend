import { ApiProperty } from "@nestjs/swagger";
import { IsString, Matches } from "class-validator";
import { RuleDto } from "src/rules";

export class UpdateFeatureFlagDto {

    @ApiProperty({ example: 'This is the description of the flag', description: 'The description for the feature flag' })
    @IsString()
    readonly description: string;

    @ApiProperty({ type: () => [RuleDto], description: 'The list of rules for the feature flag' })
    readonly rules: RuleDto[];
}