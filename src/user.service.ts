import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

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

  async sync(names: string[]): Promise<User[]> {
    const users: User[] = [];

    for (const name of names) {
      const savedUser = await this.userRepository.save({ name });
      users.push(savedUser);
    }

    return users;
  }

  async getAll(): Promise<User[]> {
    return this.userRepository.find({
      order: { createdAt: 'DESC' },
    });
  }
}
