import { BaseRepository } from '@/base/base-repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {
    super(userRepo);
  }

  async create(createUserDto: CreateUserDto, manager?: EntityManager) {
    const repo = this.getRepository(manager);

    const { displayName, avatar } = createUserDto;

    const created = repo.create({
      displayName,
      avatar,
    });

    const saved = await repo.save(created);
    return saved;
  }

  async findById(id: string) {
    const user = await this.userRepo.findOneBy({
      id,
    });
    return user;
  }
}
