import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateEnvironmentDto {
  @ApiProperty({ example: 'Staging', description: 'Environment name'})
  @IsString()
  readonly name: string;
}