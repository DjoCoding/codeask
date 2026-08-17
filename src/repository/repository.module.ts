import { GithubModule } from '@/github/github.module';
import { IngestionModule } from '@/ingestion/ingestion.module';
import { IngestionProcessor } from '@/ingestion/processors/ingestion.processor';
import { UserModule } from '@/user/user.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from './entities/repository.entity';
import { RepositoryRepository } from './repositories/repository.repository';
import { RepositoryController } from './repository.controller';
import { RepositoryService } from './services/repository.service';

@Module({
  imports: [
    UserModule,
    GithubModule,
    IngestionModule,
    TypeOrmModule.forFeature([Repository]),
  ],
  providers: [RepositoryService, RepositoryRepository, IngestionProcessor],
  controllers: [RepositoryController],
})
export class RepositoryModule {}
