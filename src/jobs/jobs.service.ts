import { Injectable } from '@nestjs/common';
import { JoinOptions } from 'typeorm';
import { Job } from '../entities/Job.entity';
import IBasicService from '../intefaces/services/ibasic.service';
import { JobsRepository } from './jobs.repository';

@Injectable()
export class JobsService implements IBasicService<Job> {
  constructor(private jobsRepository: JobsRepository) {}

  async getAll(loadRelations?: string[]): Promise<Job[]> {
    return this.jobsRepository.find({
      join: {
        alias: 'job',
        leftJoinAndSelect: {
          ...loadRelations?.reduce(
            (acc, relation) => ({ ...acc, [relation]: `job.${relation}` }),
            {},
          ),
        },
      } as JoinOptions,
    });
  }

  async findById(id: string, loadRelations?: string[]): Promise<Job> {
    return this.jobsRepository.findOne(id, {
      relations: loadRelations,
    });
  }

  async getAllFilteredByUserId(
    userId: string,
    loadRelations?: string[],
  ): Promise<Job[]> {
    return this.jobsRepository.find({
      where: { user: { id: userId } },
      relations: loadRelations,
    });
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
