import { EntityRepository, Repository } from 'typeorm';
import { User as UserEntity } from '../entities/User.entity';

@EntityRepository(UserEntity)
export class UsersRepository extends Repository<UserEntity> {}
