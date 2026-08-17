import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRepositoryDto } from '../dtos/create-repository.dto';
import { Repository as ERepository } from '../entities/repository.entity';

@Injectable()
export class RepositoryRepository {
  constructor(
    @InjectRepository(ERepository)
    private readonly repositoryRepository: Repository<ERepository>,
  ) {}

  async create(dto: CreateRepositoryDto) {
    const { defaultBranch, githubId, name, owner } = dto;

    const created = this.repositoryRepository.create({
      githubId,
      name,
      owner,
      defaultBranch,
    });

    const saved = await this.repositoryRepository.save(created);
    return saved;
  }

  async findByGithubId(githubId: string) {
    const repo = await this.repositoryRepository.findOneBy({
      githubId,
    });

    return repo;
  }
}
