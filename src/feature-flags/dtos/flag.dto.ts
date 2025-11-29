import { ApiProperty } from "@nestjs/swagger";

export class FlagDto {
    @ApiProperty({ example: 'feature-flag-1', description: 'The unique identifier for the feature flag' })
    readonly id: string;


    @ApiProperty({ example: 'new-feature', description: 'The key for the feature flag' })
    readonly key: string;

    @ApiProperty({ example: 'New Feature', description: 'The name of the feature flag' })
    readonly name: string;

    @ApiProperty({ example: 'This is a new feature flag', description: 'The description of the feature flag' })
    readonly description: string;

    @ApiProperty({ example: 'boolean', description: 'The type of the feature flag' })
    readonly type: 'boolean' | 'string' | 'number' | 'json';

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'The date the feature flag was created' })
    readonly createdAt: Date;

    @ApiProperty({ example: '2024-01-02T00:00:00.000Z', description: 'The date the feature flag was last updated' })
    readonly updatedAt: Date;
}