import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormModuleMock } from '../../test/unit/bootstrap/typeorm.module.mock';
import { CaslAbilityFactory } from '../casl/casl.ability.factory';
import { CaslModule } from '../casl/casl.module';
import { Job } from '../entities/Job.entity';
import { User, UserRole } from '../entities/User.entity';
import { UsersModule } from '../users/users.module';
import { UsersRepository } from '../users/users.repository';
import { CreateJobDTO } from './dtos/create.job.dto';
import { UpdateJobDTO } from './dtos/update.job.dto';
import { JobsController } from './jobs.controller';
import { JobsRepository } from './jobs.repository';
import { JobsService } from './jobs.service';

describe('JobsController', () => {
  let moduleRef: TestingModule;
  let jobsController: JobsController;
  let jobsRepository: JobsRepository;
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
      controllers: [JobsController],
      providers: [JobsService],
    }).compile();

    jobsController = moduleRef.get<JobsController>(JobsController);
    jobsRepository = moduleRef.get(JobsRepository);
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

  describe('getAllJobs', () => {
    it('should return all jobs for manager user', async () => {
      const r = await jobsController.getAllJobs(testManagerUser);
      expect(r.length).toBe(
        testManagerUser.jobs.length + testRegularUser.jobs.length,
      );
      expect(r).toMatchObject([
        ...testManagerUser.jobs,
        ...testRegularUser.jobs,
      ]);
    });

    it('should return owned jobs for regular user', async () => {
      const r = await jobsController.getAllJobs(testRegularUser);
      expect(r.length).toBe(testRegularUser.jobs.length);
      expect(r).toMatchObject([...testRegularUser.jobs]);
    });
  });

  describe('createJob', () => {
    it('should return a valid created job', async () => {
      const testJob: CreateJobDTO = { title: 'AAA', description: '' };
      const r = await jobsController.createJob(testRegularUser, testJob);
      const dbJob = await jobsRepository.findOne(r.id);
      expect(r).toMatchObject(dbJob);
    });
  });

  describe('UpdateJob', () => {
    it('should allow manager to update regular user job', async () => {
      const dbJob = await jobsRepository.findOne({
        where: { user: testManagerUser },
        relations: ['user'],
      });
      const testJob: UpdateJobDTO = { title: 'AAA', description: '' };
      const r = await jobsController.updateJob(testManagerUser, dbJob, testJob);
      expect(r).toMatchObject(testJob);
    });

    it('should allow regular user to update owned job', async () => {
      const dbJob = await jobsRepository.findOne({
        where: { user: testRegularUser },
        relations: ['user'],
      });

      const testJob: UpdateJobDTO = { title: 'AAA', description: '' };
      const r = await jobsController.updateJob(testRegularUser, dbJob, testJob);
      expect(r).toMatchObject(testJob);
    });

    it('should disallow regular user to update not owned job', async () => {
      const dbJob = await jobsRepository.findOne({
        where: { user: testManagerUser },
        relations: ['user'],
      });

      const testJob: UpdateJobDTO = { title: 'AAA', description: '' };
      await expect(() =>
        jobsController.updateJob(testRegularUser, dbJob, testJob),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  afterEach(async () => {
    moduleRef.close();
  });
});
