import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { CreateGithubAccountDto } from '../dtos/create-github-account.dto';
import { GithubAccountRepository } from '../repositories/github-account.repository';

@Injectable()
export class GithubAccountService {
  constructor(private readonly githubAccountRepo: GithubAccountRepository) {}

  async findByGithubId(id: string) {
    const account = await this.githubAccountRepo.findByGithubId(id);
    return account;
  }

  async create(
    createGithubAccountDto: CreateGithubAccountDto,
    manager?: EntityManager,
  ) {
    const account = await this.githubAccountRepo.create(
      createGithubAccountDto,
      manager,
    );
    return account;
  }
}
