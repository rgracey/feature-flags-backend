import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from './user.entity';
import { AuthenticationModule } from 'src/authentication/authentication.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([User]),
    forwardRef(() => AuthenticationModule),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule { }
