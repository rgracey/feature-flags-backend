import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUserDto } from '../dtos';

export const AuthUser = createParamDecorator(
    (_: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user as AuthUserDto;
    },
);