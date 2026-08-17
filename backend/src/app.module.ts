import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BullmqModule } from './bullmq/bullmq.module';
import configuration from './config/configuration';
import { DatabaseModule } from './database/database.module';
import { GithubModule } from './github/github.module';
import { IngestionModule } from './ingestion/ingestion.module';
import { RepositoryModule } from './repository/repository.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      load: [configuration],
    }),
    AuthModule,
    UserModule,
    RepositoryModule,
    GithubModule,
    BullmqModule,
    IngestionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
