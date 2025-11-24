import { forwardRef, Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersModule } from 'src/users';
import { JwtGuard } from './guards';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {},
      }),
    }),
    forwardRef(() => UsersModule),
  ],
  providers: [AuthenticationService, JwtGuard],
  controllers: [AuthenticationController],
  exports: [JwtGuard, JwtModule],
})
export class AuthenticationModule { }
