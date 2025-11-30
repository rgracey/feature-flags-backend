import { ApiProperty } from "@nestjs/swagger";

export class VariationValueDto {
    @ApiProperty({ example: 'boolean', description: 'The type of the variation value', enum: ['boolean', 'string', 'number', 'json'] })
    readonly type: 'boolean' | 'string' | 'number' | 'json';

    @ApiProperty({ example: true, description: 'The value of the variation', oneOf: [{ type: 'boolean' }, { type: 'string' }, { type: 'number' }, { type: 'object' }] })
    readonly data: boolean | string | number | object;
}

export class VariationDto {
    @ApiProperty({ example: 'variation-1', description: 'The unique identifier for the variation' })
    readonly id: string;

    @ApiProperty({ example: 'On', description: 'The name of the variation' })
    readonly name: string;

    @ApiProperty({ example: 'This is the true variation', description: 'The description of the variation' })
    readonly description: string;

    @ApiProperty({ type: VariationValueDto, description: 'The value of the variation' })
    readonly value: VariationValueDto;

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'The date the feature flag was created' })
    readonly createdAt: Date;

    @ApiProperty({ example: '2024-01-02T00:00:00.000Z', description: 'The date the feature flag was last updated' })
    readonly updatedAt: Date;
}