import { EntityManager, ObjectLiteral, Repository } from 'typeorm';

export abstract class BaseRepository<T extends ObjectLiteral> {
  protected constructor(private readonly repository: Repository<T>) {}

  protected getRepository(manager?: EntityManager) {
    return manager
      ? manager.getRepository(this.repository.target)
      : this.repository;
  }
}
