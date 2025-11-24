import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'hello@example.com', description: 'User email'})
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: 'strongPassword123', description: 'User password'})
  @IsString()
  readonly password: string;
}