import { GithubService } from '@/github/github.service';
import { Repository } from '@/repository/entities/repository.entity';
import { InjectQueue } from '@nestjs/bullmq';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Queue } from 'bullmq';
import path from 'path';
import { INGEST_REPOSITORY_JOB } from '../constants/jobs';
import { REPOSITORY_INGESTION_QUEUE } from '../constants/queues';
import { EXTRACTION_SERVICE } from '../constants/symbols';
import { CreateIngestionDto } from '../dtos/create-ingestion.dto';
import { IngestRepositoryJobPayload } from '../dtos/ingest-repository-job-payload.dto';
import { IngestionStatus } from '../enums/ingestion-status.enum';
import type { ExtractionService } from '../interfaces/extraction-service.interface';
import { IngestionRepository } from '../repositories/ingestion.repository';
import { ArchiveService } from './archive.service';
import { StorageService } from './storage.service';

@Injectable()
export class IngestionService {
  constructor(
    @InjectQueue(REPOSITORY_INGESTION_QUEUE)
    private readonly repositoryIngestionQueue: Queue,

    @Inject(EXTRACTION_SERVICE)
    private readonly extractionService: ExtractionService,

    private readonly githubService: GithubService,
    private readonly ingestionRepository: IngestionRepository,
    private readonly archiveService: ArchiveService,
    private readonly storageService: StorageService,
  ) {}

  private async findByRepositoryIdAndCommitSha(
    repositoryId: string,
    commitSha: string,
  ) {
    const ingestion =
      await this.ingestionRepository.findByRepositoryIdAndCommitSha(
        repositoryId,
        commitSha,
      );

    return ingestion;
  }

  private async create(dto: CreateIngestionDto) {
    const created = await this.ingestionRepository.create(dto);
    return created;
  }

  async markAsCompleted(id: string) {
    await this.ingestionRepository.markStatus(id, IngestionStatus.COMPLETED);
  }

  async markAsFailed(id: string) {
    await this.ingestionRepository.markStatus(id, IngestionStatus.FAILED);
  }

  //   this is not the github repository id, it is the internal repository id
  async ingest(repository: Repository) {
    const commit = await this.githubService.findLatestCommit(
      repository.githubId,
    );

    const existingIngestion = await this.findByRepositoryIdAndCommitSha(
      repository.id,
      commit.sha,
    );

    if (existingIngestion !== null) return existingIngestion;

    const createdIngestion = await this.create({
      repositoryId: repository.id,
      commitSha: commit.sha,
    });

    const payload: IngestRepositoryJobPayload = {
      ingestionId: createdIngestion.id,
    };

    const _ = await this.repositoryIngestionQueue.add(
      INGEST_REPOSITORY_JOB,
      payload,
    );

    const ingestion = await this.findByIdOrThrow(createdIngestion.id);
    return ingestion;
  }

  async findById(id: string) {
    const ingestion = await this.ingestionRepository.findById(id);
    return ingestion;
  }

  async findByIdOrThrow(id: string) {
    const ingestion = await this.findById(id);
    if (ingestion === null) {
      throw new NotFoundException('ingestion not found');
    }
    return ingestion;
  }

  private getArchivePath(archiveDirPath: string, name: string) {
    const format = this.githubService.ARCHIVE_FORMAT;
    const fullname = `${name}.${format}`;

    const parts = [archiveDirPath, fullname];
    return parts.join(path.sep);
  }

  async createWorkspace(id: string) {
    return this.storageService.createIngestionWorkspace(id);
  }

  async cleanUpWorkspace(id: string) {
    return this.storageService.cleanUpIngestionWorkspace(id);
  }

  async run(ingestionId: string) {
    const ingestion = await this.findByIdOrThrow(ingestionId);
    const { commitSha, repository } = ingestion;

    const workspacePath = await this.createWorkspace(ingestionId);

    const reader = await this.githubService.downloadRepositoryArchive(
      repository.githubId,
      commitSha,
    );

    const archiveDirPath =
      this.storageService.getIngestionArchiveDirectoryPath(workspacePath);
    const archivePath = this.getArchivePath(archiveDirPath, repository.name);
    await this.archiveService.persistArchive(reader, archivePath);

    const sourcePath =
      this.storageService.getIngestionSourceDirectoryPath(workspacePath);
    await this.extractionService.extract(archivePath, sourcePath);

    await this.markAsCompleted(ingestionId);
    this;
  }
}
