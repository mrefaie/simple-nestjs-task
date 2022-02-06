import { Injectable } from '@nestjs/common';
import { Job } from '../entities/Job.entity';
import IBasicService from '../intefaces/services/ibasic.service';
import { JobsRepository } from './jobs.repository';

@Injectable()
export class JobsService implements IBasicService<Job> {
  constructor(private jobsRepository: JobsRepository) {}

  async getAll(): Promise<Job[]> {
    return this.jobsRepository.find({
      join: {
        alias: 'job',
        leftJoinAndSelect: {
          user: 'job.user',
        },
      },
    });
  }

  async findById(id: string): Promise<Job> {
    return this.jobsRepository.findOne(id, {
      relations: ['user'],
    });
  }

  async getByUserId(userId: string): Promise<Job[]> {
    return this.jobsRepository.find({ where: { User: { id: userId } } });
  }

  async create(job: Job): Promise<Job> {
    const newJob: Job = await this.jobsRepository.save(job);
    return newJob;
  }

  async update(oldJob: Job, newJobEntity: Job): Promise<Job> {
    const job: Job = await this.jobsRepository.merge({
      ...oldJob,
      ...newJobEntity,
    });
    const newJob: Job = await this.jobsRepository.save(job);
    return newJob;
  }
}
