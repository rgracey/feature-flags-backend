import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateProjectDto {
    @ApiProperty({ example: 'My awesome project', description: 'Project name' })
    @IsString()
    readonly name: string;
}