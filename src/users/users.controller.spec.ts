import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormModuleMock } from '../../test/unit/bootstrap/typeorm.module.mock';
import { CaslModule } from '../casl/casl.module';
import { User, UserRole } from '../entities/User.entity';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  const testManagerUser = new User({
    email: 'admin@example.com',
    role: UserRole.MANAGER,
  });

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ...TypeormModuleMock(),
        TypeOrmModule.forFeature([UsersRepository]),
        CaslModule,
      ],
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();
    // usersService = moduleRef.get<UsersService>(UsersService);
    usersController = moduleRef.get<UsersController>(UsersController);
  });

  describe('me', () => {
    it('should return logged in user', async () => {
      expect(await usersController.me(testManagerUser)).toBe(testManagerUser);
    });
  });
});
