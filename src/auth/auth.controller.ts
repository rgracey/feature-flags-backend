import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto, LoginSuccessDto } from './dto';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @ApiOperation({ summary: 'User login' })
    @ApiResponse({ status: 200, description: 'The user has been successfully logged in.' })
    @Post('login')
    async login(@Body() loginDto: LoginDto): Promise<LoginSuccessDto> {
        const maybeTokens = await this.authService.authenticateEmailPassword(loginDto.email, loginDto.password);

        if (!maybeTokens) {
            throw new UnauthorizedException('Invalid email or password');
        }

        return maybeTokens;
    }

    @ApiOperation({ summary: 'User registration' })
    @ApiResponse({ status: 201, description: 'The user has been successfully registered.' })
    @Post('register')
    async register(@Body() registerDto: LoginDto): Promise<LoginSuccessDto> {
        return this.authService.registerEmailPassword(registerDto.email, registerDto.password);
    }
}
