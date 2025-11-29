import { Module } from '@nestjs/common';
import { EvaluationService, RulesService } from './services';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AuthorisationModule } from 'src/authorisation';
import { Ruleset } from './entities/ruleset.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([Ruleset]),
    AuthorisationModule,
  ],
  providers: [RulesService, EvaluationService],
  exports: [RulesService, EvaluationService],
})
export class RulesModule { }
