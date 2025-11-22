import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
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
  providers: [AuthService, JwtGuard],
  controllers: [AuthController],
  exports: [JwtGuard, JwtModule],
})
export class AuthModule { }
