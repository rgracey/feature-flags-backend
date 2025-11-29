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

    @ApiProperty({ example: 'boolean', description: 'The type of the feature flag', enum: ['boolean', 'string', 'number', 'json'] })
    @IsEnum(['boolean', 'string', 'number', 'json'])
    readonly type: 'boolean' | 'string' | 'number' | 'json';
}