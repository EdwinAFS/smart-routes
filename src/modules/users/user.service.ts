import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(name: string): Promise<User> {
    const newUser = this.userRepository.create({ name });
    return this.userRepository.save(newUser);
  }

  async sync(names: string[]): Promise<void> {
    for (const name of names) {
      await this.userRepository.save({ name });
    }

    return;
  }

  async getAll(): Promise<User[]> {
    return this.userRepository.find({
      order: { createdAt: 'DESC' },
    });
  }
}

