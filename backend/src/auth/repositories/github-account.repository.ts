import { BaseRepository } from '@/base/base-repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CreateGithubAccountDto } from '../dtos/create-github-account.dto';
import { GithubAccount } from '../entities/github-account.entity';

@Injectable()
export class GithubAccountRepository extends BaseRepository<GithubAccount> {
  constructor(
    @InjectRepository(GithubAccount)
    private readonly githubAccountRepo: Repository<GithubAccount>,
  ) {
    super(githubAccountRepo);
  }

  async findByGithubId(id: string) {
    const account = await this.githubAccountRepo.findOne({
      where: {
        githubId: id,
      },
      relations: {
        user: true,
      },
    });
    return account;
  }

  async create(
    createGithubAccountDto: CreateGithubAccountDto,
    manager?: EntityManager,
  ) {
    const repo = this.getRepository(manager);

    const { username, githubId, accessToken, refreshToken, userId } =
      createGithubAccountDto;

    const created = repo.create({
      githubId,
      username,
      accessToken,
      refreshToken,
      user: {
        id: userId,
      },
    });

    const saved = await repo.save(created);
    return saved;
  }
}
