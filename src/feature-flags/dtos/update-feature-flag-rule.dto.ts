import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class FeatureFlagRuleDto {
    @ApiProperty({ example: 'My rule 1', description: 'The name of the rule', required: false })
    @IsString()
    readonly name?: string;

    // TODO - conditions
}