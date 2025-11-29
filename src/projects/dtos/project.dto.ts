import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ProjectDto {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Project ID' })
    @IsString()
    readonly id: string;

    @ApiProperty({ example: 'My awesome project', description: 'Project name' })
    @IsString()
    readonly name: string;
}