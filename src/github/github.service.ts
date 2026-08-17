import {
  BadGatewayException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GithubRepositoryCommit } from './dtos/github-repository-commit.dto';
import { GithubRepositoryTree } from './dtos/github-repository-tree.dto';
import { GithubRepository } from './dtos/github-repository.dto';

@Injectable()
export class GithubService {
  readonly ARCHIVE_FORMAT = 'zip';

  constructor() {}

  async resolveRepository(repositoryUrl: string) {
    const url = new URL(repositoryUrl);
    const [owner, name] = url.pathname.split('/').filter(Boolean);

    const route = `https://api.github.com/repos/${owner}/${name}`;
    const res = await fetch(route, {
      headers: {
        Accept: 'application/vnd.github+json',
      },
    });

    if (!res.ok) {
      if (res.status === 404) {
        throw new NotFoundException(`repository "${repositoryUrl}" not found`);
      }
      throw new BadGatewayException('failed to resolve repository');
    }

    const repo = await res.json();
    return repo as GithubRepository;
  }

  async findLatestCommit(id: string) {
    const route = `https://api.github.com/repositories/${id}/commits?per_page=1`;
    const res = await fetch(route, {
      headers: {
        Accept: 'application/vnd.github+json',
      },
    });

    if (!res.ok) {
      if (res.status === 409) {
        throw new ConflictException('repository is empty');
      }
      throw new BadGatewayException('failed to fetch repository latest commit');
    }

    const data = await res.json();
    const commits = data as GithubRepositoryCommit[];

    return commits[0];
  }

  async treeifyRepository(id: string) {
    const route = `https://api.github.com/repositories/${id}/git/trees`;
    const res = await fetch(route, {
      headers: {
        Accept: 'application/vnd.github+json',
      },
    });

    if (!res.ok) {
      throw new BadGatewayException('failed to fetch repository tree');
    }

    const tree = await res.json();
    return tree as GithubRepositoryTree;
  }

  async downloadRepositoryArchive(id: string, commitSha: string) {
    const route = `https://api.github.com/repositories/${id}/zipball/${commitSha}`;
    const res = await fetch(route);

    if (!res.ok || !res.body) {
      throw new BadGatewayException('failed to download repository archive');
    }

    const reader = res.body.getReader();
    return reader;
  }
}
