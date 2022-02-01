import { EntityRepository, Repository } from 'typeorm';
import { Job as JobEntity } from '../entities/Job.entity';

@EntityRepository(JobEntity)
export class JobsRepository extends Repository<JobEntity> {}
