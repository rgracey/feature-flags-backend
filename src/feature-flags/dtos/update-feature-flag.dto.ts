import { ApiProperty } from "@nestjs/swagger";
import { IsString, Matches } from "class-validator";
import { FeatureFlagRuleDto } from "./update-feature-flag-rule.dto";

export class UpdateFeatureFlagDto {

    @ApiProperty({ example: 'This is the description of the flag', description: 'The description for the feature flag' })
    @IsString()
    description: string;

    @ApiProperty({ type: () => [FeatureFlagRuleDto], description: 'The list of rules for the feature flag' })
    rules: FeatureFlagRuleDto[];
}