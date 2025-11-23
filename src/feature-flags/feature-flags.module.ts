import { Module } from '@nestjs/common';
import { FeatureFlagsController } from './feature-flags.controller';
import { FeatureFlagsService } from './feature-flags.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { FeatureFlag } from './entities';
import { AuthModule } from 'src/auth/auth.module';
import { ProjectsModule } from 'src/projects';
import { AuthorisationModule } from 'src/authorisation/authorisation.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([FeatureFlag]),
    AuthModule,
    AuthorisationModule,
    ProjectsModule,
  ],
  controllers: [FeatureFlagsController],
  providers: [FeatureFlagsService]
})
export class FeatureFlagsModule { }
