import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsString } from "class-validator";
import { FeatureFlagRuleDto } from "src/rules";

export class UpdateFeatureFlagDto {

    @ApiProperty({ example: 'This is the description of the flag', description: 'The description for the feature flag' })
    @IsString()
    readonly description: string;

    @ApiProperty({
        description: 'The rules for the feature flag',
        type: [FeatureFlagRuleDto]
    })
    @IsArray()
    readonly rules: FeatureFlagRuleDto[];
}