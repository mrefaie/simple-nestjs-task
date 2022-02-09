import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormModuleMock } from '../../test/unit/bootstrap/typeorm.module.mock';
import { Action } from '../casl/casl.actions';
import { CaslModule } from '../casl/casl.module';
import { Job } from '../entities/Job.entity';
import { User, UserRole } from '../entities/User.entity';
import hash from '../helpers/hash';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let usersService: UsersService;
  let moduleRef: TestingModule;

  let testManagerUser = new User({
    email: 'admin@example.com',
    password: '123456',
    role: UserRole.MANAGER,
  });

  let testRegularUser = new User({
    email: 'regular@example.com',
    password: '123456',
    role: UserRole.REGULAR,
  });

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        ...TypeormModuleMock(),
        TypeOrmModule.forFeature([UsersRepository]),
        CaslModule,
      ],
      providers: [UsersService],
    }).compile();

    const usersRepository = await moduleRef.resolve(UsersRepository);

    let user = await usersRepository.create(testManagerUser);
    await usersRepository.save(user);
    delete user.password;
    testManagerUser = new User({ ...testManagerUser, ...user });

    user = await usersRepository.create(testRegularUser);
    await usersRepository.save(user);
    delete user.password;
    testRegularUser = new User({ ...testRegularUser, ...user });

    usersService = moduleRef.get<UsersService>(UsersService);
  });

  describe('fineOneByEmailAndPassword', () => {
    it('should return user by email and hashed password', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWitoutPassword } = testManagerUser;

      expect(
        await usersService.fineOneByEmailAndPassword(
          testManagerUser.email,
          hash(testManagerUser.password),
        ),
      ).toEqual(new User(userWitoutPassword));
    });

    it('should return user by email and hashed password and ability functions', async () => {
      const r = await usersService.fineOneByEmailAndPassword(
        testManagerUser.email,
        hash(testManagerUser.password),
        [],
        true,
      );
      expect(r.ability).toBeDefined();
      expect(typeof r.ability).toBe('function');
      expect(typeof r.ability().can).toBe('function');
    });
  });

  describe('fineOneByEmail', () => {
    it('should return user by email', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWitoutPassword } = testManagerUser;
      expect(await usersService.fineOneByEmail(testManagerUser.email)).toEqual(
        new User(userWitoutPassword),
      );
    });
  });

  describe('ManagerAbilities', () => {
    it('should allow manager to manage all jobs', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWitoutPassword } = testManagerUser;
      const r = await usersService.fineOneByEmailAndPassword(
        testManagerUser.email,
        hash(testManagerUser.password),
        [],
        true,
      );

      expect(r.ability().can(Action.MANAGE, new Job({}))).toBe(true);
    });
  });

  describe('RegularAbilities', () => {
    it('should disallow regular user to manage all jobs', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWitoutPassword } = testRegularUser;
      const r = await usersService.fineOneByEmailAndPassword(
        testRegularUser.email,
        hash(testRegularUser.password),
        [],
        true,
      );

      expect(r.ability().can(Action.MANAGE, new Job({}))).toBe(false);
    });

    it('should allow regular user to manage own jobs', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWitoutPassword } = testRegularUser;
      const r = await usersService.fineOneByEmailAndPassword(
        testRegularUser.email,
        hash(testRegularUser.password),
        [],
        true,
      );

      expect(
        r
          .ability()
          .can(
            Action.MANAGE,
            new Job({ user: new User({ id: testRegularUser.id }) }),
          ),
      ).toBe(true);
    });
  });

  afterEach(async () => {
    moduleRef.close();
  });
});
