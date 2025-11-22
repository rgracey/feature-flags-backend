
import {
    CanActivate,
    ExecutionContext,
    forwardRef,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsersService } from 'src/users';
import { AuthUserDto } from '../dto';

@Injectable()
export class JwtGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            const payload = await this.jwtService.verifyAsync(token);

            const userId = payload?.sub;

            if (!userId) {
                throw new UnauthorizedException();
            }

            const user = await this.usersService.findUserById(userId);

            if (!user) {
                throw new UnauthorizedException();
            }

            request['user'] = new AuthUserDto(user.id, user.email);
        } catch {
            throw new UnauthorizedException();
        }

        return true;
    }

    /**
     * Try to extract a JWT token from the Authorization header
     * @param request the HTTP request to extract the token from
     * @returns the token if found, false otherwise
     */
    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
