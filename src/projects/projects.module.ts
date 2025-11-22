import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ProjectsService } from './projects.service';
import { Project } from './entities/project.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ProjectMembership } from './entities';

@Module({
  imports: [
    AuthModule,
    MikroOrmModule.forFeature([
      Project,
      ProjectMembership
    ]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService]
})
export class ProjectsModule { }
