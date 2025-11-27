import { Module } from '@nestjs/common';
import { SegmentsService } from './services';
import { SegmentsController } from './controllers';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Segment } from './entities/segment.entity';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { AuthorisationModule } from 'src/authorisation';
import { RulesModule } from 'src/rules';

@Module({
  imports: [
    MikroOrmModule.forFeature([Segment]),
    AuthenticationModule,
    AuthorisationModule,
    RulesModule,
  ],
  providers: [SegmentsService],
  controllers: [SegmentsController]
})
export class SegmentsModule {}
