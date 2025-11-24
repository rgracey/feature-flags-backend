import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class FeatureFlagRuleConditionDto {
    @ApiProperty({ example: "country", description: "The attribute to check" })
    @IsString()
    readonly attribute: string;

    @ApiProperty({ example: "==", description: "The operator to use for comparison" })
    @IsString()
    readonly operator: string;

    @ApiProperty({ example: "US", description: "The value to compare against" })
    @IsString()
    readonly value: string;
}