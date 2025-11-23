import { Module } from '@nestjs/common';
import { EnvironmentsService } from './environments.service';
import { EnvironmentsController } from './environments.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ProjectsModule } from 'src/projects';
import { Environment } from './environment.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AuthorisationModule } from 'src/authorisation';

@Module({
  imports: [
    MikroOrmModule.forFeature([Environment]),
    AuthModule,
    AuthorisationModule,
    ProjectsModule,
  ],
  providers: [EnvironmentsService],
  controllers: [EnvironmentsController]
})
export class EnvironmentsModule { }
