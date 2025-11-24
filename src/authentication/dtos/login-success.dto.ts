import { IsString } from 'class-validator';

export class LoginSuccessDto {
    @IsString()
    readonly accessToken: string;

    @IsString()
    readonly refreshToken: string;
}