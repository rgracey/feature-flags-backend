import { Module } from '@nestjs/common';
import { EnvironmentsService } from './environments.service';
import { EnvironmentsController } from './environments.controller';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { ProjectsModule } from 'src/projects';
import { Environment } from './environment.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AuthorisationModule } from 'src/authorisation';

@Module({
  imports: [
    MikroOrmModule.forFeature([Environment]),
    AuthenticationModule,
    AuthorisationModule,
    ProjectsModule,
  ],
  providers: [EnvironmentsService],
  controllers: [EnvironmentsController]
})
export class EnvironmentsModule { }
