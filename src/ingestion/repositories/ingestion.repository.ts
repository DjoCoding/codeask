import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateIngestionDto } from '../dtos/create-ingestion.dto';
import { Ingestion } from '../entities/ingestion.entity';
import { IngestionStatus } from '../enums/ingestion-status.enum';

@Injectable()
export class IngestionRepository {
  constructor(
    @InjectRepository(Ingestion)
    private readonly ingestionRepo: Repository<Ingestion>,
  ) {}

  async findByRepositoryIdAndCommitSha(
    repositoryId: string,
    commitSha: string,
  ) {
    const ingestion = await this.ingestionRepo.findOne({
      where: {
        repository: {
          id: repositoryId,
        },
        commitSha,
      },
      relations: {
        repository: true,
      },
    });
    return ingestion;
  }

  async findById(id: string) {
    const ingestion = await this.ingestionRepo.findOne({
      where: { id },
      relations: {
        repository: true,
      },
    });
    return ingestion;
  }

  async create(dto: CreateIngestionDto) {
    const { repositoryId, commitSha } = dto;

    const created = this.ingestionRepo.create({
      repository: {
        id: repositoryId,
      },
      commitSha,
    });

    const saved = await this.ingestionRepo.save(created);
    return saved;
  }

  async markStatus(id: string, status: IngestionStatus) {
    await this.ingestionRepo.update(
      {
        id,
      },
      {
        status,
      },
    );
  }
}
