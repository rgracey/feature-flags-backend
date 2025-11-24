import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UsersModule } from './users';
import { AuthenticationModule } from './authentication/authentication.module';
import { ConfigModule } from '@nestjs/config';
import { ProjectsModule } from './projects/projects.module';
import { EnvironmentsModule } from './environments/environments.module';
import { FeatureFlagsModule } from './feature-flags/feature-flags.module';
import { AuthorisationModule } from './authorisation/authorisation.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MikroOrmModule.forRoot({}),
    AuthorisationModule,
    UsersModule,
    AuthenticationModule,
    ProjectsModule,
    EnvironmentsModule,
    FeatureFlagsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
