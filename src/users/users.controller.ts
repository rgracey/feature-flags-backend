import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUserDto, JwtGuard, AuthUser } from 'src/auth';

@ApiTags('users')
@Controller({ path: 'users', version: '1' })
export class UsersController {

    constructor() { }

    @ApiOperation({ summary: 'Get the current user' })
    @UseGuards(JwtGuard)
    @ApiBearerAuth()
    @Get('me')
    async getMe(@AuthUser() user: AuthUserDto) {
        return user;
    }
}
