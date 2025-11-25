import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString, Matches } from "class-validator";

export class CreateFeatureFlagDto {
    @ApiProperty({ example: 'brand_new_feature', description: 'The unique key for the feature flag' })
    @IsString()
    @Matches(/^[a-z]+(_[a-z]+)*$/, { message: 'Key must be lowercase and use underscores to separate words' })
    readonly key: string;

    @ApiProperty({ example: 'Brand New Feature', description: 'The display name for the feature flag' })
    @IsString()
    readonly name: string;

    @ApiProperty({ example: 'This feature flag enables the brand new feature.', description: 'A brief description of the feature flag', required: false })
    @IsString()
    readonly description?: string

    @ApiProperty({ example: 'false', description: 'The default value for the feature flag' })
    @IsString()
    readonly defaultValue: string;

    @ApiProperty({
        example: 'boolean',
        enum: ['boolean', 'string', 'number', 'json'],
        description: 'The type of value the feature flag holds (e.g., boolean, string, number)'
    })
    @IsEnum(['boolean', 'string', 'number', 'json'])
    readonly valueType: string;
}