import { Module } from '@nestjs/common';
import { AuthorisationService } from './authorisation.service';
import { ProjectsModule } from 'src/projects';

@Module({
  imports: [
    ProjectsModule
  ],
  providers: [AuthorisationService],
  exports: [AuthorisationService],
})
export class AuthorisationModule { }
