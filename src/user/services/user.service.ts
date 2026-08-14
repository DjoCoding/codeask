import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto, manager?: EntityManager) {
    const user = await this.userRepository.create(createUserDto, manager);
    return user;
  }

  async findById(id: string) {
    const user = await this.userRepository.findById(id);
    return user;
  }
}
