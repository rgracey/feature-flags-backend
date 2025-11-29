import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginSuccessDto {
    @ApiProperty({ description: 'The access token for the authenticated user' })
    @IsString()
    readonly accessToken: string;

    @ApiProperty({ description: 'The refresh token for the authenticated user' })
    @IsString()
    readonly refreshToken: string;
}