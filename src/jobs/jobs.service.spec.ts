import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormModuleMock } from '../../test/unit/bootstrap/typeorm.module.mock';
import { CaslAbilityFactory } from '../casl/casl.ability.factory';
import { CaslModule } from '../casl/casl.module';
import { Job } from '../entities/Job.entity';
import { User, UserRole } from '../entities/User.entity';
import { UsersModule } from '../users/users.module';
import { UsersRepository } from '../users/users.repository';
import { JobsRepository } from './jobs.repository';
import { JobsService } from './jobs.service';

describe('JobsController', () => {
  let moduleRef: TestingModule;
  let jobsRepository: JobsRepository;
  let jobsService: JobsService;
  let usersRepository: UsersRepository;
  let caslAbilityFactory: CaslAbilityFactory;

  let testManagerUser = new User({
    email: 'admin@example.com',
    password: '123456',
    role: UserRole.MANAGER,
    jobs: [
      new Job({
        title: 'ABC',
        description: '',
      }),
    ],
  });

  let testRegularUser = new User({
    email: 'regular@example.com',
    password: '123456',
    role: UserRole.REGULAR,
    jobs: [
      new Job({
        title: 'ABC2',
        description: '',
      }),
    ],
  });

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        ...TypeormModuleMock(),
        TypeOrmModule.forFeature([JobsRepository]),
        UsersModule,
        CaslModule,
      ],
      providers: [JobsService],
    }).compile();

    jobsRepository = moduleRef.get(JobsRepository);
    jobsService = moduleRef.get(JobsService);
    usersRepository = moduleRef.get(UsersRepository);
    caslAbilityFactory = moduleRef.get(CaslAbilityFactory);

    let user = await usersRepository.create(testManagerUser);
    await usersRepository.save(user);
    delete user.password;
    testManagerUser = new User({ ...testManagerUser, ...user });
    const managerAbility = caslAbilityFactory.createForUser(testManagerUser);
    testManagerUser.ability = () => managerAbility;
    await jobsRepository.insert(
      testManagerUser.jobs.map((j) => new Job({ ...j, user: testManagerUser })),
    );

    user = await usersRepository.create(testRegularUser);
    await usersRepository.save(user);
    delete user.password;
    testRegularUser = new User({ ...testRegularUser, ...user });
    const regularAbility = caslAbilityFactory.createForUser(testRegularUser);
    testRegularUser.ability = () => regularAbility;
    await jobsRepository.insert(
      testRegularUser.jobs.map((j) => new Job({ ...j, user: testRegularUser })),
    );
  });

  describe('getAll', () => {
    it('should return all jobs', async () => {
      const r = await jobsService.getAll();
      const dbJobs = await jobsRepository.find();
      expect(r).toStrictEqual(dbJobs);
    });

    it('should return all jobs with users', async () => {
      const r = await jobsService.getAll(['user']);
      const dbJobs = await jobsRepository.find({ relations: ['user'] });
      expect(r).toStrictEqual(dbJobs);
    });
  });

  describe('findById', () => {
    it('should return job by id', async () => {
      const dbJob = await jobsRepository.findOne();
      const r = await jobsService.findById(dbJob.id);
      expect(r).toStrictEqual(dbJob);
    });

    it('should return job with user by id', async () => {
      const dbJob = await jobsRepository.findOne({ relations: ['user'] });
      const r = await jobsService.findById(dbJob.id, ['user']);
      expect(r).toStrictEqual(dbJob);
    });
  });

  describe('getAllFilteredByUserId', () => {
    it('should return all jobs filtered by user id', async () => {
      const dbUser = await usersRepository.findOne();
      const dbJobs = await jobsRepository.find({ where: { user: dbUser } });
      const r = await jobsService.getAllFilteredByUserId(dbUser.id);
      expect(r).toStrictEqual(dbJobs);
    });

    it('should return all jobs with user object filtered by user id', async () => {
      const dbUser = await usersRepository.findOne();
      const dbJobs = await jobsRepository.find({
        where: { user: dbUser },
        relations: ['user'],
      });
      const r = await jobsService.getAllFilteredByUserId(dbUser.id, ['user']);
      expect(r).toStrictEqual(dbJobs);
    });
  });

  describe('create', () => {
    it('should return a newly created job', async () => {
      const testJob = new Job({ title: 'Aaa', description: '' });
      const r = await jobsService.create(testJob);
      expect(r).toBeInstanceOf(Job);
      expect(r.id).toBeDefined();
    });
  });

  describe('update', () => {
    it('should return updated job', async () => {
      const dbJob = await jobsRepository.findOne();
      const r = await jobsService.update(
        dbJob,
        new Job({ title: dbJob.title + 'x' }),
      );
      const newDbJob = await jobsRepository.findOne(dbJob.id);
      expect(r).toMatchObject(new Job({ title: dbJob.title + 'x' }));
      expect(r).toEqual(newDbJob);
    });
  });

  afterEach(async () => {
    moduleRef.close();
  });
});
