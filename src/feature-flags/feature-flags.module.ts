import { Module } from '@nestjs/common';
import { FeatureFlagsController } from './controllers';
import { FeatureFlagsService } from './services';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { FeatureFlag } from './entities';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { AuthorisationModule } from 'src/authorisation/authorisation.module';
import { EvaluationService } from '../rules/services/evaluation.service';
import { RulesModule } from 'src/rules';

@Module({
  imports: [
    MikroOrmModule.forFeature([FeatureFlag]),
    AuthenticationModule,
    AuthorisationModule,
    RulesModule
  ],
  controllers: [FeatureFlagsController],
  providers: [FeatureFlagsService, EvaluationService],
})
export class FeatureFlagsModule { }
