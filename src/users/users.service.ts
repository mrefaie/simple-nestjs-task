import { Injectable } from '@nestjs/common';
import { CaslAbilityFactory } from '../casl/casl.ability.factory';
import { User, UserRole } from '../entities/User.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  public async getAllManagers(): Promise<User[]> {
    return this.usersRepository.find({ where: { role: UserRole.MANAGER } });
  }

  public async fineOneByEmailAndPassword(
    email: string,
    password: string,
    loadRelations?: string[],
    loadAbility?: boolean,
  ): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { email, password },
      relations: loadRelations,
    });
    user && loadAbility && this.attachAbility(user);
    return user;
  }

  public async fineOneByEmail(
    email: string,
    loadRelations?: string[],
    loadAbility?: boolean,
  ): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { email },
      relations: loadRelations,
    });
    loadAbility && this.attachAbility(user);
    return user;
  }

  private attachAbility(user: User) {
    const ability = this.caslAbilityFactory.createForUser(user);
    user.ability = () => ability;
  }
}
