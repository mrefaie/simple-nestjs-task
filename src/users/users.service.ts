import { Injectable } from '@nestjs/common';
import { User } from '../entities/User.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  public async fineOneByEmail(email): Promise<User> {
    return this.usersRepository.findOne({ email: email });
  }
}
