import { Module } from '@nestjs/common';
import { EvaluationService, RulesService } from './services';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Rule } from './entities/rule.entity';
import { AuthorisationModule, AuthorisationService } from 'src/authorisation';

@Module({
  imports: [
    MikroOrmModule.forFeature([Rule]),
    AuthorisationModule,
  ],
  providers: [RulesService, EvaluationService],
  exports: [RulesService, EvaluationService],
})
export class RulesModule { }
