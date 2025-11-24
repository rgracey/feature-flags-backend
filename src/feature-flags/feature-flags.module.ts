import { Module } from '@nestjs/common';
import { FeatureFlagsController } from './controllers';
import { FeatureFlagsService } from './services';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { FeatureFlag } from './entities';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { AuthorisationModule } from 'src/authorisation/authorisation.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([FeatureFlag]),
    AuthenticationModule,
    AuthorisationModule,
  ],
  controllers: [FeatureFlagsController],
  providers: [FeatureFlagsService]
})
export class FeatureFlagsModule { }
