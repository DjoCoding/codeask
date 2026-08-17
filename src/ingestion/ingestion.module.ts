import { GithubModule } from '@/github/github.module';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { REPOSITORY_INGESTION_QUEUE } from './constants/queues';
import { EXTRACTION_SERVICE } from './constants/symbols';
import { Ingestion } from './entities/ingestion.entity';
import { IngestionRepository } from './repositories/ingestion.repository';
import { ArchiveService } from './services/archive.service';
import { IngestionService } from './services/ingestion.service';
import { StorageService } from './services/storage.service';
import { ZipExtractionService } from './services/zip-extraction.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: REPOSITORY_INGESTION_QUEUE,
    }),
    TypeOrmModule.forFeature([Ingestion]),
    GithubModule,
  ],
  providers: [
    IngestionService,
    IngestionRepository,
    ArchiveService,
    StorageService,
    { provide: EXTRACTION_SERVICE, useClass: ZipExtractionService },
  ],
  exports: [IngestionService],
})
export class IngestionModule {}
