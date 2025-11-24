import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { ProjectsService } from './projects.service';
import { Project } from './entities/project.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ProjectMembership } from './entities';
import { ProjectMembershipsService } from './project-memberships.service';

@Module({
  imports: [
    AuthenticationModule,
    MikroOrmModule.forFeature([
      Project,
      ProjectMembership
    ]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectMembershipsService],
  exports: [ProjectMembershipsService],
})
export class ProjectsModule { }
