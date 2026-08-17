import { GithubService } from '@/github/github.service';
import { IngestionService } from '@/ingestion/services/ingestion.service';
import { Injectable } from '@nestjs/common';
import { RepositoryRepository } from '../repositories/repository.repository';

@Injectable()
export class RepositoryService {
  constructor(
    private readonly githubService: GithubService,
    private readonly repositoryRepository: RepositoryRepository,
    private readonly ingestionService: IngestionService,
  ) {}

  async ingest(url: string) {
    const githubRepo = await this.githubService.resolveRepository(url);

    const {
      id,
      default_branch,
      name,
      owner: { login },
    } = githubRepo;

    let repo = await this.repositoryRepository.findByGithubId(id);
    if (repo === null) {
      repo = await this.repositoryRepository.create({
        githubId: id,
        defaultBranch: default_branch,
        name,
        owner: login,
      });
    }

    const ingestion = await this.ingestionService.ingest(repo);
    return ingestion;
  }
}
